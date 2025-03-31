# 🖥️ Raspberry Pi Kiosk Technical Setup Guide (Headless)

This guide describes how to set up a Raspberry Pi 4 as a **kiosk display** that automatically launches a full-screen Chromium browser to a specific website.

---

## 🔧 Placeholder Summary

This guide uses placeholders. Please replace them with your actual values:

- `<WIFI-SSID>` → your Wi-Fi network name
- `<WIFI-PASSWORD>` → your Wi-Fi password
- `<TARGET-URL>` → the URL to display in the kiosk browser
- `<HOSTNAME>` → the desired hostname for the Raspberry Pi (e.g., `raspberrypi`; set by admin, see internal doc)
- `<USER>` → the username for the Raspberry Pi OS (e.g., `pi`; set by admin, see internal doc)
- `<PASSWORD>` → the password for the user (set by admin, see internal doc)
- `<HOST>` → the IP address or mDNS hostname of your Pi (e.g., `raspberrypi.local`; set by admin, see internal doc)
- `<UID>` → the user ID (get it using `id <USER>`, e.g., `1000`)

---

## 🧑‍💻 Technical Setup

### What You Need

- Raspberry Pi 4 B
- Raspberry Pi OS with desktop
- MicroSD card (16GB or more)
- Monitor and HDMI cable
- Wi-Fi credentials:
  - SSID: `<WIFI-SSID>`
  - Password: `<WIFI-PASSWORD>`
- Website to display: `<TARGET-URL>`

---

### Flash Raspberry Pi OS

1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Choose "Raspberry Pi OS (32-bit) with Desktop"
3. Press `Ctrl + Shift + X` to open advanced settings:
   - Set hostname: `<HOSTNAME>.local`
   - Enable SSH ✅
   - Set username: `<USER>`
   - Set password: `<PASSWORD>`
   - Configure Wi-Fi:
     - SSID: `<WIFI-SSID>`
     - Password: `<WIFI-PASSWORD>`
     - Country: `DE`

---

### Manual Setup (Optional)

#### Enable SSH
- Create an empty file named `ssh` (no file extension) in the `boot` partition

#### Configure Wi-Fi
Create a file named `wpa_supplicant.conf` in the `boot` partition with:

```conf
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="<WIFI-SSID>"
    psk="<WIFI-PASSWORD>"
    key_mgmt=WPA-PSK
}
```

---

### Connect via SSH

1. Boot the Raspberry Pi
2. Find its IP or hostname:
   ```bash
   ping <HOSTNAME>.local
   ```
   Or use [Advanced IP Scanner](https://www.advanced-ip-scanner.com/) and find the device with `raspberry` in the name
3. Connect:
   ```bash
   ssh <USER>@<HOST>
   ```
   Password: `<PASSWORD>`

---

### Install Kiosk Components

```bash
sudo apt update
sudo apt install --no-install-recommends \
  xserver-xorg x11-xserver-utils xinit openbox \
  chromium-browser unclutter -y
```

---

### Create Kiosk Script

```bash
nano /home/<USER>/kiosk.sh
```
👉 Replace `<USER>` with user name

Paste:

```bash
#!/bin/bash
xset s off
xset -dpms
xset s noblank
unclutter -idle 0 &
chromium-browser --noerrdialogs --disable-infobars --kiosk "<TARGET-URL>"
```
👉 Replace `<TARGET-URL>` with the url you want do display

Make executable:

```bash
chmod +x /home/<USER>/kiosk.sh
```
👉 Replace `<USER>` with user name

---

### Create systemd Service

```bash
sudo nano /etc/systemd/system/kiosk.service
```

Paste:

```ini
[Unit]
Description=Kiosk Mode for Chromium
After=graphical.target

[Service]
User=<USER>
Environment=XDG_RUNTIME_DIR=/run/user/<UID>
Environment=DISPLAY=:0
ExecStart=/home/<USER>/kiosk.sh
Restart=always
RestartSec=10

[Install]
WantedBy=graphical.target
```

👉 Replace `<USER>` with user name and  `<UID>` with the actual user ID (find it with `id <USER>`)

---

### Enable and Start Kiosk Service

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable kiosk.service
sudo systemctl start kiosk.service
```

Reboot to test:

```bash
sudo reboot
```

---

### 🙏 Troubleshooting

- Chromium missing?
  ```bash
  sudo apt install chromium-browser
  ```

- Emojis not showing?
  ```bash
  sudo apt install fonts-noto-color-emoji
  ```

- Manual browser test:
  ```bash
  DISPLAY=:0 chromium-browser --kiosk "<TARGET-URL>"
  ```
