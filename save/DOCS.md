# SAVE

A standalone web interface to upload and restore backups, view logs, check the configuration and restart or start the Home Assistant core, **even when the core will not start**. It talks to the Supervisor directly, so it does not depend on the core.

The interface is available in English and Hungarian (switch with EN / HU at the top right; the choice is remembered).

## Access

`http://<your Home Assistant address>:4360`, for example `http://homeassistant.local:4360`.

## Protection

There is **no password**: anyone who can reach port `4360` on your local network can open the page. Restoring still needs an explicit confirmation (checkbox). Other websites cannot send requests to SAVE through your browser.

For encrypted backups, Home Assistant needs the encryption key (Emergency kit). SAVE does not store it; it only passes it to the Supervisor.

## Features

- **Status:** Supervisor and core state, free space.
- **Upload:** pick or drop a `.tar` backup. SAVE checks it is a real Home Assistant backup (`backup.json`) and stores it as `<slug>.tar` in `/backup`.
- **Restore:**
  - *Home Assistant configuration only* (default): add-ons are not touched.
  - *Full restore:* add-ons are replaced too. **If this add-on is not in the backup, the Supervisor may remove it.** Then re-add it from the `\\<Pi address>\addons` share.
- **Core actions:** check configuration, restart, start.
- **Logs:** core, Supervisor and host logs (last 400 lines).

## Installation

1. Copy the `backup_rescue` folder to the Pi's `addons` Samba share: `\\<Pi address>\addons\backup_rescue`. `config.yaml` must be directly inside that folder.
2. In Home Assistant: **Settings → Add-ons → Add-on store → ⋮ (top right) → Check for updates**.
3. A **Local add-ons** section appears with **SAVE**. Install it (the image is built on the Pi, a few minutes), then start it.
4. Enable **Start on boot** and **Watchdog**.

## Troubleshooting

- **Add-on not listed:** make sure `config.yaml` is directly in the `backup_rescue` folder, not in a subfolder.
- **Restore returns an error:** the message comes verbatim from the Supervisor and is shown in the banner. A wrong key gives `Invalid password`.
- **Uploaded backup missing in HA's list:** SAVE reloads the list after upload; it is still available and restorable from SAVE either way.

## Magyarul röviden

Önálló webfelület mentések feltöltéséhez és visszaállításához, naplók megnézéséhez és a core újraindításához akkor is, ha a Home Assistant core nem indul. Nincs jelszó, csak a helyi hálózaton érhető el (`http://<Pi címe>:4360`). Telepítés: másold a `backup_rescue` mappát a `\\<Pi címe>\addons` megosztásra, majd Beállítások → Addonok → Addon-áruház → ⋮ → Frissítések keresése → Helyi addonok → SAVE. Teljes visszaállításnál a Supervisor eltávolíthatja az addont, ha nincs a mentésben; alapértelmezés a „csak konfiguráció”.
