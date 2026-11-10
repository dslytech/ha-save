# SAVE - backup upload & restore for Home Assistant

[![Add this repository to your Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fdslytech%2Fha-save)

**SAVE** is a standalone web page (a Home Assistant add-on) that lets you restore a backup **even when Home Assistant core will not start**. It talks to the Supervisor directly, so it keeps working when the core is down. The interface looks like the "Upload backup" screen of the Home Assistant onboarding.

- Upload a `.tar` backup (drag and drop) and restore it
- Restore the Home Assistant configuration only (default) or everything (full restore)
- Encrypted backups: enter the encryption key (Emergency kit)
- View the core, Supervisor and host logs
- Check the configuration, restart or start the core
- English and Hungarian UI (switch at the top right, remembered in the browser)

Open `http://<your Home Assistant address>:4360` after starting the add-on.

## Install

1. In Home Assistant: **Settings → Add-ons → Add-on store → ⋮ → Repositories**.
2. Add `https://github.com/dslytech/ha-save` (or press the button above).
3. Find **SAVE** in the store, install it, start it, and enable **Start on boot** and **Watchdog**.

You can also copy the `save` folder to the `addons` share of your Home Assistant and use it as a local add-on.

## Important: read before using

- **There is no password.** Anyone who can reach port `4360` on your network can open the page and restore or upload backups. Use it on a trusted home network only and **never expose the port to the internet**.
- The add-on runs with `hassio_role: manager` (it needs this to restore backups and control the core).
- A **full restore** replaces add-ons too. If SAVE is not part of the backup, the Supervisor may remove it. The default mode (configuration only) does not touch add-ons.
- Try a restore with a non-important backup first. Keep your backups and your encryption key somewhere safe.
- This project is provided as is, with no warranty. It was tested against a mock Supervisor and in a browser; it has had little testing on real Home Assistant systems so far. Reports from real setups are welcome as issues.

## Hungarian / Magyarul

A **SAVE** egy önálló webfelület (Home Assistant addon), amivel mentést tölthetsz fel és állíthatsz vissza akkor is, ha a Home Assistant core nem indul el. Jelszó nincs, ezért csak megbízható helyi hálózaton használd, és a `4360`-as portot soha ne tedd ki az internetre. Teljes visszaállításnál a Supervisor eltávolíthatja az addont, ha nincs a mentésben, ezért az alapbeállítás a „csak konfiguráció". Telepítés: Beállítások → Addonok → Addon-áruház → ⋮ → Tárolók, és add hozzá: `https://github.com/dslytech/ha-save`.

Developed with the assistance of Anthropic Claude.
