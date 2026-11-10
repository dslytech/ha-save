"use strict";

/* ------------------------------------------------------------ translations */

const I18N = {
  en: {
    title: "SAVE – Backup upload & restore",
    tagline: "Upload and restore backups even when Home Assistant won't start",
    status_h: "Status",
    free_space: "Free space for backups",
    btn_check: "Check configuration",
    btn_restart: "Restart core",
    btn_start: "Start core",
    upload_h: "Upload backup",
    upload_sub: "Upload a backup from your device",
    choose: "Choose backup file",
    drag: "Or drag and drop file here",
    supports: "Supports .TAR files",
    backups_h: "Backups on this device",
    refresh: "Refresh",
    no_backups: "No backups in the /backup folder.",
    logs_h: "Logs",
    tab_host: "Host",
    log_hint: "Click a tab to load the log.",
    restore_h: "Restore",
    opt_config: "Home Assistant configuration only",
    recommended: "(recommended)",
    opt_config_sub: "Does not touch add-ons or SAVE.",
    opt_full: "Full restore",
    opt_full_sub: "Replaces add-ons too. If this add-on is not in the backup, the restore may remove it.",
    key_label: "Encryption key (Emergency kit)",
    sure: "I understand the backup will overwrite the current data.",
    cancel: "Cancel",
    start_restore: "Start restore",
    running: "Running",
    unavailable: "Unavailable: ",
    responding: "Responding",
    not_responding: "Not responding",
    unknown: "unknown",
    banner_running: (slug, jobs) => "Restore in progress (" + slug + "). Do not unplug the device.\n" +
      "This page may stop responding meanwhile, that is normal. When the core responds again, it is done.\n" + jobs,
    banner_failed: "Restore failed: ",
    banner_done: "Restore finished.",
    dismiss: "Dismiss",
    tag_encrypted: "encrypted",
    tag_full: "full",
    tag_partial: "partial",
    addons_n: (n) => n + (n === 1 ? " add-on" : " add-ons"),
    restore_btn: "Restore…",
    confirm_restart: "Restart the Home Assistant core?",
    lbl_check: "Configuration check",
    lbl_restart: "Restart core",
    lbl_start: "Start core",
    config_ok: "Configuration is valid.",
    sent: ": sent.",
    config_err: "Configuration error:\n",
    error_prefix: "Error: ",
    err_generic: (code) => "Error (" + code + ")",
    loading: "Loading…",
    empty: "(empty)",
    failed: "Failed: ",
    only_tar: "Only .tar files can be uploaded.",
    no_space: (free, need) => "Not enough free space: " + free + " free, " + need + " needed.",
    starting: "Starting upload…",
    done: "Done.",
    up_existing: "This backup was already here, you can find it in the list.",
    up_new: "Backup uploaded, you can find it in the list.",
    interrupted: "Upload interrupted (network error).",
    m_name: "Name",
    m_date: "Date",
    m_size: "Size",
    m_addons: "Add-ons",
    none: "none",
    locale: "en-GB",
    srv: {},
  },
  hu: {
    title: "SAVE – Mentés feltöltése és visszaállítása",
    tagline: "Mentés feltöltése és visszaállítása akkor is, ha a Home Assistant nem indul",
    status_h: "Állapot",
    free_space: "Szabad hely a mentéseknek",
    btn_check: "Konfiguráció ellenőrzése",
    btn_restart: "Core újraindítása",
    btn_start: "Core indítása",
    upload_h: "Biztonsági mentés feltöltése",
    upload_sub: "Biztonsági mentés feltöltése az eszközről",
    choose: "Biztonsági mentési fájl kiválasztása",
    drag: "Vagy húzza ide a fájlt",
    supports: ".TAR fájlokat támogat",
    backups_h: "Mentések ezen a gépen",
    refresh: "Frissítés",
    no_backups: "Nincs mentés a /backup mappában.",
    logs_h: "Napló",
    tab_host: "Gép",
    log_hint: "Kattints egy fülre a napló betöltéséhez.",
    restore_h: "Visszaállítás",
    opt_config: "Csak a Home Assistant konfiguráció",
    recommended: "(ajánlott)",
    opt_config_sub: "Az addonokhoz és a SAVE-hez nem nyúl.",
    opt_full: "Teljes visszaállítás",
    opt_full_sub: "Az addonokat is cseréli. Ha ez az addon nincs a mentésben, a visszaállítás eltávolíthatja.",
    key_label: "Titkosítási kulcs (Emergency kit)",
    sure: "Értem, a jelenlegi adatokat felülírja a mentés.",
    cancel: "Mégse",
    start_restore: "Visszaállítás indítása",
    running: "Működik",
    unavailable: "Nem elérhető: ",
    responding: "Válaszol",
    not_responding: "Nem válaszol",
    unknown: "ismeretlen",
    banner_running: (slug, jobs) => "Visszaállítás folyamatban (" + slug + "). Ne húzd ki a gépet.\n" +
      "Az oldal közben megszakadhat, ez normális. Ha a core újra válaszol, kész.\n" + jobs,
    banner_failed: "A visszaállítás nem sikerült: ",
    banner_done: "A visszaállítás lefutott.",
    dismiss: "Elrejtés",
    tag_encrypted: "titkosított",
    tag_full: "teljes",
    tag_partial: "részleges",
    addons_n: (n) => n + " addon",
    restore_btn: "Visszaállítás…",
    confirm_restart: "Újraindítod a Home Assistant core-t?",
    lbl_check: "Konfiguráció ellenőrzése",
    lbl_restart: "Core újraindítása",
    lbl_start: "Core indítása",
    config_ok: "A konfiguráció rendben van.",
    sent: ": elküldve.",
    config_err: "Konfigurációs hiba:\n",
    error_prefix: "Hiba: ",
    err_generic: (code) => "Hiba (" + code + ")",
    loading: "Betöltés…",
    empty: "(üres)",
    failed: "Nem sikerült: ",
    only_tar: "Csak .tar fájl tölthető fel.",
    no_space: (free, need) => "Nincs elég szabad hely: " + free + " szabad, " + need + " kell.",
    starting: "Feltöltés indul…",
    done: "Kész.",
    up_existing: "Ez a mentés már megvolt, a listában megtalálod.",
    up_new: "A mentés feltöltve, a listában megtalálod.",
    interrupted: "A feltöltés megszakadt (hálózati hiba).",
    m_name: "Név",
    m_date: "Dátum",
    m_size: "Méret",
    m_addons: "Addonok",
    none: "nincs",
    locale: "hu-HU",
    srv: {
      "Not found.": "Nem található.",
      "Cross-origin request blocked.": "Idegen eredetű kérés blokkolva.",
      "Unknown log source.": "Ismeretlen naplóforrás.",
      "Unknown action.": "Ismeretlen művelet.",
      "Invalid backup ID.": "Érvénytelen mentés azonosító.",
      "Unknown mode.": "Ismeretlen mód.",
      "This backup is not in the /backup folder.": "Ez a mentés nincs a /backup mappában.",
      "This backup is encrypted, enter the encryption key.": "Ez a mentés titkosított, add meg a titkosítási kulcsot.",
      "A restore is already in progress.": "Már folyamatban van egy visszaállítás.",
      "Missing file size.": "Hiányzik a fájlméret.",
      "Only .tar files can be uploaded.": "Csak .tar fájl tölthető fel.",
      "The /backup folder is not accessible.": "A /backup mappa nem érhető el.",
      "An upload is already in progress.": "Már folyamatban van egy feltöltés.",
      "Upload interrupted.": "A feltöltés megszakadt.",
      "This is not a Home Assistant backup (no backup.json inside).": "Ez nem Home Assistant mentés (nincs benne backup.json).",
    },
    srvRe: [
      [/^Not enough free space \((.+) free, (.+) needed\)\.$/, "Nincs elég szabad hely ($1 szabad, $2 kell)."],
      [/^Upload error: /, "Feltöltési hiba: "],
    ],
  },
};

let lang = "en";
try {
  const saved = localStorage.getItem("save_lang");
  if (saved === "en" || saved === "hu") lang = saved;
} catch (e) { /* storage unavailable */ }

function t(key, ...args) {
  const v = (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : I18N.en[key];
  return typeof v === "function" ? v(...args) : v;
}

/* Server messages are English; translate the known ones. Supervisor messages stay as they are. */
function tsrv(msg) {
  const d = I18N[lang];
  if (!msg || lang === "en") return msg;
  if (d.srv[msg]) return d.srv[msg];
  for (const [re, rep] of d.srvRe || []) {
    if (re.test(msg)) return msg.replace(re, rep);
  }
  return msg;
}

/* ------------------------------------------------------------ helpers */

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};

let pollTimer = null;
let selected = null;
let freeBytes = null;
let lastStatus = null;
let lastBackups = [];
let logLoaded = false;

function fmtSize(n) {
  if (n >= 1073741824) return (n / 1073741824).toFixed(2) + " GB";
  return (n / 1048576).toFixed(1) + " MB";
}

function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleString(t("locale"));
}

async function api(path, opts) {
  const r = await fetch(path, Object.assign({ credentials: "same-origin" }, opts || {}));
  let data = {};
  try { data = await r.json(); } catch (e) { /* not JSON */ }
  if (!r.ok) throw new Error(data.error ? tsrv(data.error) : t("err_generic", r.status));
  return data;
}

function post(path, body) {
  return api(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
}

/* ------------------------------------------------------------ language */

function applyLang() {
  document.documentElement.lang = lang;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
  if (!logLoaded) $("log").textContent = t("log_hint");
  renderStatus();
  renderBackups();
  if (selected) renderModalInfo();
}

function setLang(l) {
  lang = l;
  try { localStorage.setItem("save_lang", l); } catch (e) { /* storage unavailable */ }
  applyLang();
}

document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

/* ------------------------------------------------------------ status */

function setStatus(node, text, cls) {
  node.textContent = text;
  node.className = cls || "";
}

function showBanner(text, cls, dismissable) {
  const b = $("banner");
  if (!text) { b.classList.add("hidden"); return; }
  b.replaceChildren(el("span", null, text));
  if (dismissable) {
    const x = el("button", "btn link", t("dismiss"));
    x.type = "button";
    x.addEventListener("click", async () => {
      try { await post("/api/restore/ack"); } catch (e) { /* ignore */ }
      refreshStatus();
    });
    b.appendChild(x);
  }
  b.className = "banner" + (cls ? " " + cls : "");
}

function renderStatus() {
  const s = lastStatus;
  if (!s) return;
  freeBytes = s.disk_free;
  if (s.supervisor.ok) setStatus($("stSup"), t("running") + " (" + s.supervisor.version + ")", "ok");
  else setStatus($("stSup"), t("unavailable") + s.supervisor.error, "bad");
  const ver = s.core.version ? " (" + s.core.version + ")" : "";
  if (s.core.web) setStatus($("stCore"), t("responding") + ver, "ok");
  else setStatus($("stCore"), t("not_responding") + ver, "bad");
  $("stDisk").textContent = freeBytes == null ? t("unknown") : fmtSize(freeBytes);

  const r = s.restore || {};
  const jobs = (s.jobs || []).map((j) => "• " + j.name + (j.progress != null ? " (" + Math.round(j.progress) + "%)" : "")).join("\n");
  if (r.state === "running" || r.state === "submitted") {
    showBanner(t("banner_running", r.slug || "", jobs), "", r.state === "submitted");
  } else if (r.state === "error") {
    showBanner(t("banner_failed") + r.message, "bad", true);
  } else if (r.state === "done") {
    showBanner(t("banner_done"), "good", true);
  } else {
    showBanner("");
  }
}

async function refreshStatus() {
  try { lastStatus = await api("/api/status"); } catch (e) { return; }
  renderStatus();
}

function renderBackups() {
  const ul = $("backups");
  ul.replaceChildren();
  $("noBackups").classList.toggle("hidden", lastBackups.length > 0);
  lastBackups.forEach((b) => {
    const li = el("li");
    const info = el("div");
    const name = el("div", "b-name", b.name || b.slug);
    if (b.protected) name.appendChild(el("span", "tag", t("tag_encrypted")));
    if (b.type) name.appendChild(el("span", "tag", b.type === "full" ? t("tag_full") : t("tag_partial")));
    info.appendChild(name);
    const meta = [fmtDate(b.date), fmtSize(b.size)];
    if (b.ha_version) meta.push("HA " + b.ha_version);
    if (b.addons.length) meta.push(t("addons_n", b.addons.length));
    info.appendChild(el("div", "b-meta", meta.join(" · ")));
    info.appendChild(el("div", "b-meta", b.file));
    li.appendChild(info);
    const btn = el("button", "btn primary", t("restore_btn"));
    btn.type = "button";
    btn.addEventListener("click", () => openModal(b));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function refreshBackups() {
  try { lastBackups = (await api("/api/backups")).backups; } catch (e) { return; }
  renderBackups();
}

function refreshAll() {
  refreshStatus();
  refreshBackups();
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(refreshStatus, 4000);
}

$("reload").addEventListener("click", refreshAll);

/* ------------------------------------------------------------ core actions */

document.querySelectorAll("[data-core]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.core;
    const label = t("lbl_" + action);
    if (action === "restart" && !window.confirm(t("confirm_restart"))) return;
    $("coreMsg").textContent = label + "…";
    btn.disabled = true;
    try {
      await post("/api/core", { action });
      $("coreMsg").textContent = action === "check" ? t("config_ok") : label + t("sent");
    } catch (err) {
      $("coreMsg").textContent = (action === "check" ? t("config_err") : t("error_prefix")) + err.message;
    } finally {
      btn.disabled = false;
      refreshStatus();
    }
  });
});

/* ------------------------------------------------------------ logs */

async function loadLog(src) {
  document.querySelectorAll("#logTabs button").forEach((b) => b.classList.toggle("active", b.dataset.src === src));
  logLoaded = true;
  $("log").textContent = t("loading");
  try {
    const d = await api("/api/logs?source=" + encodeURIComponent(src));
    $("log").textContent = d.log || t("empty");
    $("log").scrollTop = $("log").scrollHeight;
  } catch (err) {
    $("log").textContent = t("failed") + err.message;
  }
}

document.querySelectorAll("#logTabs button").forEach((b) => b.addEventListener("click", () => loadLog(b.dataset.src)));

/* ------------------------------------------------------------ upload */

const drop = $("drop");

$("pick").addEventListener("click", () => $("file").click());
$("file").addEventListener("change", () => { if ($("file").files[0]) upload($("file").files[0]); });

["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", (e) => {
  const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) upload(f);
});

function upload(file) {
  $("uploadMsg").textContent = "";
  if (!file.name.toLowerCase().endsWith(".tar")) {
    $("uploadMsg").textContent = t("only_tar");
    return;
  }
  if (freeBytes != null && file.size > freeBytes - 50 * 1048576) {
    $("uploadMsg").textContent = t("no_space", fmtSize(freeBytes), fmtSize(file.size));
    return;
  }
  const xhr = new XMLHttpRequest();
  const started = Date.now();
  $("progress").classList.remove("hidden");
  $("barFill").style.width = "0";
  $("progressText").textContent = t("starting");
  xhr.open("PUT", "/api/upload?filename=" + encodeURIComponent(file.name));
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.upload.onprogress = (e) => {
    if (!e.lengthComputable) return;
    const pct = (e.loaded / e.total) * 100;
    const secs = Math.max(1, (Date.now() - started) / 1000);
    $("barFill").style.width = pct.toFixed(1) + "%";
    $("progressText").textContent = fmtSize(e.loaded) + " / " + fmtSize(e.total) + " · " + (e.loaded / 1048576 / secs).toFixed(1) + " MB/s";
  };
  xhr.onload = () => {
    let d = {};
    try { d = JSON.parse(xhr.responseText); } catch (e) { /* not JSON */ }
    $("file").value = "";
    if (xhr.status >= 200 && xhr.status < 300) {
      $("barFill").style.width = "100%";
      $("progressText").textContent = t("done");
      $("uploadMsg").textContent = d.existing ? t("up_existing") : t("up_new");
      refreshAll();
    } else {
      $("progress").classList.add("hidden");
      $("uploadMsg").textContent = t("error_prefix") + (d.error ? tsrv(d.error) : xhr.status);
    }
  };
  xhr.onerror = () => {
    $("progress").classList.add("hidden");
    $("uploadMsg").textContent = t("interrupted");
  };
  xhr.send(file);
}

/* ------------------------------------------------------------ restore dialog */

function renderModalInfo() {
  const b = selected;
  const info = $("mInfo");
  info.replaceChildren();
  [[t("m_name"), b.name || b.slug], [t("m_date"), fmtDate(b.date)], [t("m_size"), fmtSize(b.size)],
   ["Home Assistant", b.ha_version || "?"], [t("m_addons"), b.addons.length ? b.addons.join(", ") : t("none")]]
    .forEach(([k, v]) => {
      const row = el("div");
      row.appendChild(el("dt", null, k));
      row.appendChild(el("dd", null, v));
      info.appendChild(row);
    });
}

function openModal(b) {
  selected = b;
  $("mErr").textContent = "";
  $("sure").checked = false;
  $("mGo").disabled = true;
  $("key").value = "";
  $("keyRow").classList.toggle("hidden", !b.protected);
  document.querySelector('input[name="mode"][value="config"]').checked = true;
  renderModalInfo();
  $("modal").classList.remove("hidden");
  $("sure").focus();
}

function closeModal() {
  $("modal").classList.add("hidden");
  selected = null;
}

$("sure").addEventListener("change", () => { $("mGo").disabled = !$("sure").checked; });
$("mCancel").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) closeModal(); });

$("mGo").addEventListener("click", async () => {
  if (!selected) return;
  const mode = document.querySelector('input[name="mode"]:checked').value;
  $("mErr").textContent = "";
  $("mGo").disabled = true;
  try {
    await post("/api/restore", { slug: selected.slug, mode, password: selected.protected ? $("key").value : "" });
    closeModal();
    refreshStatus();
  } catch (err) {
    $("mErr").textContent = err.message;
    $("mGo").disabled = !$("sure").checked;
  }
});

/* ------------------------------------------------------------ start */

applyLang();
refreshAll();
startPolling();
