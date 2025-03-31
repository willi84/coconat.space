# 🧑 User Instructions

## 🔁 Restarting the Raspberry Pi

### Option A: Power Cycle (easiest)

- Unplug the USB-C power cable and plug it back in  
- **Leave HDMI cable connected** to prevent screen size issues on boot

---

### Option B: Restart via Terminal (SSH)

1. Open Terminal
   - Windows: use PowerShell or [Putty](https://www.heise.de/tipps-tricks/Raspberry-Pi-SSH-einrichten-so-geht-s-4190645.html#nav_ssh_unter__2)
2. Find your Pi using:
   ```bash
   ping <HOSTNAME>.local
   ```
   Or use [Advanced IP Scanner](https://www.advanced-ip-scanner.com/)
3. Connect:
   ```bash
   ssh <USER>@<HOST>
   ```
   Password: `<PASSWORD>`
4. Restart only the kiosk service:
   ```bash
   sudo systemctl restart kiosk.service
   ```
5. Or reboot the entire Pi:
   ```bash
   sudo reboot
   ```

---

### Option C: With Mouse (if available)

- Connect a mouse
- Use the graphical interface to reboot manually

---
