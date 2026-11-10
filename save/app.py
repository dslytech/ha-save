#!/usr/bin/env python3
"""SAVE - standalone backup upload and restore web UI for Home Assistant.

Uses only the Python standard library. It talks to the Supervisor API, so it keeps
working even when the Home Assistant core is not running.
"""
import json
import os
import re
import secrets
import shutil
import tarfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

VERSION = "1.0.1"
PORT = int(os.environ.get("RESCUE_PORT", "4360"))
BACKUP_DIR = os.environ.get("RESCUE_BACKUP_DIR", "/backup")
SUP_URL = os.environ.get("SUPERVISOR_URL", "http://supervisor").rstrip("/")
SUP_TOKEN = os.environ.get("SUPERVISOR_TOKEN", "")
CORE_PROBE_URL = os.environ.get("RESCUE_CORE_PROBE_URL", "http://homeassistant:8123/")
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
SLUG_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
ANSI_RE = re.compile(r"\x1b\[[0-9;]*[A-Za-z]")

STATIC_FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/app.js": ("app.js", "application/javascript; charset=utf-8"),
    "/style.css": ("style.css", "text/css; charset=utf-8"),
}

state_lock = threading.Lock()
upload_lock = threading.Lock()
meta_cache = {}        # (path, mtime, size) -> meta

restore_state = {"state": "idle", "slug": None, "mode": None, "started": None,
                 "message": "", "job_id": None}


def log(*args):
    print(time.strftime("%H:%M:%S"), *args, flush=True)


# ---------------------------------------------------------------- Supervisor

class SupError(Exception):
    def __init__(self, message, status=None):
        super().__init__(message)
        self.message = message
        self.status = status


def sup(method, path, body=None, timeout=30, raw=False, headers=None):
    """Supervisor API call. Raises SupError on failure."""
    h = {"Authorization": "Bearer " + SUP_TOKEN}
    data = None
    if method in ("POST", "PUT") and body is None:
        body = {}
    if body is not None:
        data = json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    if headers:
        h.update(headers)
    req = urllib.request.Request(SUP_URL + path, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            payload = r.read()
    except urllib.error.HTTPError as e:
        text = e.read().decode("utf-8", "replace")
        msg = text
        try:
            msg = json.loads(text).get("message", text)
        except Exception:
            pass
        raise SupError(msg or str(e.reason), e.code)
    except Exception as e:
        raise SupError(str(e))
    if raw:
        return payload.decode("utf-8", "replace")
    try:
        parsed = json.loads(payload)
    except Exception:
        return {}
    if isinstance(parsed, dict):
        if parsed.get("result") == "error":
            raise SupError(parsed.get("message", "Ismeretlen hiba"))
        return parsed.get("data", parsed)
    return parsed


def core_web_up():
    """True if the Home Assistant web server answers with any HTTP response."""
    try:
        urllib.request.urlopen(CORE_PROBE_URL, timeout=3).close()
        return True
    except urllib.error.HTTPError:
        return True
    except Exception:
        return False


def jobs_summary():
    """Running Supervisor jobs (for restore progress); empty on error."""
    try:
        info = sup("GET", "/jobs/info", timeout=10)
    except SupError:
        return []
    out = []

    def walk(jobs):
        for j in jobs or []:
            if not isinstance(j, dict):
                continue
            if not j.get("done"):
                out.append({"name": str(j.get("name", "")), "progress": j.get("progress"),
                            "stage": j.get("stage")})
            walk(j.get("child_jobs"))

    walk(info.get("jobs") if isinstance(info, dict) else None)
    return out[:8]


# ---------------------------------------------------------------- backups

def read_backup_meta(path):
    """Read backup.json from a backup tar. Returns None on error."""
    try:
        with tarfile.open(path, "r:") as tf:
            for member in tf:
                if member.name.lstrip("./") == "backup.json":
                    f = tf.extractfile(member)
                    if f is None:
                        return None
                    meta = json.load(f)
                    return meta if isinstance(meta, dict) else None
    except Exception:
        return None
    return None


def summarize(meta, path):
    st = os.stat(path)
    addons = meta.get("addons") or []
    names = []
    for a in addons:
        if isinstance(a, dict):
            names.append(str(a.get("name") or a.get("slug") or ""))
    ha = meta.get("homeassistant")
    return {
        "slug": str(meta.get("slug", "")),
        "name": str(meta.get("name", "")),
        "date": str(meta.get("date", "")),
        "type": str(meta.get("type", "")),
        "protected": bool(meta.get("protected")),
        "ha_version": ha if isinstance(ha, str) else (str(ha.get("version", "")) if isinstance(ha, dict) else ""),
        "addons": names,
        "folders": [str(x) for x in (meta.get("folders") or [])],
        "size": st.st_size,
        "file": os.path.basename(path),
    }


def list_backups():
    items = []
    try:
        names = sorted(os.listdir(BACKUP_DIR))
    except OSError:
        return items
    for name in names:
        if not name.endswith(".tar") or name.startswith("."):
            continue
        path = os.path.join(BACKUP_DIR, name)
        try:
            st = os.stat(path)
        except OSError:
            continue
        key = (path, st.st_mtime, st.st_size)
        meta = meta_cache.get(key)
        if meta is None:
            meta = read_backup_meta(path)
            meta_cache[key] = meta or {}
        if meta and SLUG_RE.match(str(meta.get("slug", ""))):
            items.append(summarize(meta, path))
    items.sort(key=lambda i: i["date"], reverse=True)
    return items


# ---------------------------------------------------------------- restore

def run_restore(slug, mode, password):
    path = "/backups/%s/restore/%s" % (slug, "full" if mode == "full" else "partial")
    body = {"background": True}
    if mode != "full":
        body["homeassistant"] = True
    if password:
        body["password"] = password
    try:
        try:
            result = sup("POST", path, body, timeout=3600)
        except SupError as e:
            if e.status == 400 and "background" in body:
                body.pop("background")
                result = sup("POST", path, body, timeout=3600)
            else:
                raise
        job_id = result.get("job_id") if isinstance(result, dict) else None
        with state_lock:
            restore_state.update(state="submitted" if job_id else "done", job_id=job_id,
                                 message="The Supervisor has started the restore." if job_id
                                 else "Restore finished.")
        log("restore accepted:", slug, mode)
    except SupError as e:
        with state_lock:
            restore_state.update(state="error", message=e.message)
        log("restore error:", e.message)


def start_restore(slug, mode, password):
    if not SLUG_RE.match(slug or ""):
        raise ValueError("Invalid backup ID.")
    if mode not in ("config", "full"):
        raise ValueError("Unknown mode.")
    known = {b["slug"]: b for b in list_backups()}
    if slug not in known:
        raise ValueError("This backup is not in the /backup folder.")
    if known[slug]["protected"] and not password:
        raise ValueError("This backup is encrypted, enter the encryption key.")
    with state_lock:
        if restore_state["state"] in ("running", "submitted"):
            raise ValueError("A restore is already in progress.")
        restore_state.update(state="running", slug=slug, mode=mode, started=time.time(),
                             message="Sent to the Supervisor...", job_id=None)
    threading.Thread(target=run_restore, args=(slug, mode, password), daemon=True).start()


# ---------------------------------------------------------------- HTTP

def fmt_size(n):
    return "%.1f MB" % (n / 1048576)


class Handler(BaseHTTPRequestHandler):
    server_version = "BackupRescue/" + VERSION
    timeout = 300

    def log_message(self, fmt, *args):
        log(self.address_string(), self.command, self.path.split("?")[0], "->", args[1] if len(args) > 1 else "")

    # --- helpers
    def send_bytes(self, code, body, ctype, extra=None):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy",
                         "default-src 'self'; img-src 'self' data:; frame-ancestors 'none'")
        for k, v in (extra or []):
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, code, obj, extra=None):
        self.send_bytes(code, json.dumps(obj).encode(), "application/json; charset=utf-8", extra)

    def error(self, code, message):
        self.send_json(code, {"error": message})

    def origin_ok(self):
        origin = self.headers.get("Origin")
        if not origin:
            return True
        return urllib.parse.urlparse(origin).netloc == self.headers.get("Host", "")

    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > 65536:
            return {}
        try:
            data = json.loads(self.rfile.read(length))
            return data if isinstance(data, dict) else {}
        except Exception:
            return {}

    # --- GET
    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path
        if path == "/health":
            return self.send_bytes(200, b"ok", "text/plain")
        if path in STATIC_FILES:
            name, ctype = STATIC_FILES[path]
            try:
                with open(os.path.join(STATIC_DIR, name), "rb") as f:
                    return self.send_bytes(200, f.read(), ctype)
            except OSError:
                return self.error(404, "Not found.")
        if not path.startswith("/api/"):
            return self.error(404, "Not found.")
        if path == "/api/status":
            return self.api_status()
        if path == "/api/backups":
            return self.send_json(200, {"backups": list_backups()})
        if path == "/api/logs":
            return self.api_logs(urllib.parse.parse_qs(url.query))
        self.error(404, "Not found.")

    def api_status(self):
        out = {"version": VERSION, "supervisor": {"ok": False, "version": "", "error": ""},
               "core": {"version": "", "web": core_web_up()},
               "jobs": jobs_summary()}
        with state_lock:
            # No running Supervisor jobs and the core responds again: the restore is finished.
            if (restore_state["state"] == "submitted" and not out["jobs"] and out["core"]["web"]
                    and time.time() - (restore_state["started"] or 0) > 20):
                restore_state.update(state="done", message="Restore finished.")
            out["restore"] = dict(restore_state)
        try:
            info = sup("GET", "/supervisor/info", timeout=10)
            out["supervisor"].update(ok=True, version=str(info.get("version", "")))
        except SupError as e:
            out["supervisor"]["error"] = e.message
        try:
            info = sup("GET", "/core/info", timeout=10)
            out["core"]["version"] = str(info.get("version", ""))
        except SupError:
            pass
        try:
            out["disk_free"] = shutil.disk_usage(BACKUP_DIR).free
        except OSError:
            out["disk_free"] = None
        self.send_json(200, out)

    def api_logs(self, query):
        source = (query.get("source") or ["core"])[0]
        endpoint = {"core": "/core/logs", "supervisor": "/supervisor/logs", "host": "/host/logs"}.get(source)
        if not endpoint:
            return self.error(400, "Unknown log source.")
        try:
            try:
                text = sup("GET", endpoint, raw=True, timeout=30,
                           headers={"Accept": "text/plain", "Range": "entries=:-400:"})
            except SupError:
                text = sup("GET", endpoint, raw=True, timeout=30, headers={"Accept": "text/plain"})
        except SupError as e:
            return self.error(502, e.message)
        lines = ANSI_RE.sub("", text).splitlines()[-400:]
        self.send_json(200, {"log": "\n".join(lines)})

    # --- POST
    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        if not self.origin_ok():
            return self.error(403, "Cross-origin request blocked.")
        data = self.read_json()
        if path == "/api/restore":
            try:
                start_restore(str(data.get("slug", "")), str(data.get("mode", "")),
                              str(data.get("password", "")) or None)
            except ValueError as e:
                return self.error(400, str(e))
            return self.send_json(200, {"ok": True})
        if path == "/api/restore/ack":
            with state_lock:
                if restore_state["state"] != "running":
                    restore_state.update(state="idle", message="", job_id=None)
            return self.send_json(200, {"ok": True})
        if path == "/api/core":
            return self.api_core(str(data.get("action", "")))
        self.error(404, "Not found.")

    def api_core(self, action):
        if action not in ("restart", "start", "stop", "check"):
            return self.error(400, "Unknown action.")
        try:
            sup("POST", "/core/" + action, {}, timeout=300 if action == "check" else 60)
        except SupError as e:
            # for a failed config check the message itself is the useful information
            return self.error(400 if action == "check" else 502, e.message)
        log("core action:", action)
        self.send_json(200, {"ok": True})

    # --- PUT (backup upload)
    def do_PUT(self):
        url = urllib.parse.urlparse(self.path)
        if url.path != "/api/upload":
            return self.error(404, "Not found.")
        if not self.origin_ok():
            return self.error(403, "Cross-origin request blocked.")
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        filename = (urllib.parse.parse_qs(url.query).get("filename") or [""])[0]
        if length <= 0:
            return self.error(411, "Missing file size.")
        if not filename.lower().endswith(".tar"):
            return self.error(400, "Only .tar files can be uploaded.")
        try:
            free = shutil.disk_usage(BACKUP_DIR).free
        except OSError:
            return self.error(500, "The /backup folder is not accessible.")
        if length > free - 50 * 1048576:
            return self.error(507, "Not enough free space (%s free, %s needed)." % (fmt_size(free), fmt_size(length)))
        if not upload_lock.acquire(blocking=False):
            return self.error(409, "An upload is already in progress.")
        tmp = os.path.join(BACKUP_DIR, ".rescue-upload-%s.part" % secrets.token_hex(4))
        try:
            received = 0
            with open(tmp, "wb") as out:
                while received < length:
                    chunk = self.rfile.read(min(1048576, length - received))
                    if not chunk:
                        break
                    out.write(chunk)
                    received += len(chunk)
            if received != length:
                os.remove(tmp)
                return self.error(400, "Upload interrupted.")
            meta = read_backup_meta(tmp)
            slug = str(meta.get("slug", "")) if meta else ""
            if not SLUG_RE.match(slug):
                os.remove(tmp)
                return self.error(400, "This is not a Home Assistant backup (no backup.json inside).")
            dest = os.path.join(BACKUP_DIR, slug + ".tar")
            existing = os.path.exists(dest)
            if existing:
                os.remove(tmp)
            else:
                os.replace(tmp, dest)
            try:
                sup("POST", "/backups/reload", {}, timeout=60)
            except SupError as e:
                log("backups/reload hiba:", e.message)
            log("uploaded:", slug, fmt_size(length), "(already existed)" if existing else "")
            return self.send_json(200, {"ok": True, "existing": existing,
                                        "backup": summarize(meta, dest)})
        except Exception as e:
            log("upload error:", e)
            try:
                os.remove(tmp)
            except OSError:
                pass
            return self.error(500, "Upload error: %s" % e)
        finally:
            upload_lock.release()


def main():
    log("SAVE %s starting on port %d (no password, local network only)" % (VERSION, PORT))
    if not SUP_TOKEN:
        log("WARNING: no SUPERVISOR_TOKEN, Supervisor calls will not work.")
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.daemon_threads = True
    server.serve_forever()


if __name__ == "__main__":
    main()
