# 07. Design System: Cyber-Industrial Mission Control

## 1. Filosofi Estetika
Aether OS mengadopsi estetika **Deep Obsidian Cyber-Industrial Mission Control & Aerospace Radar**. Desain ini menggabungkan tema gelap berdensitas tinggi, kontras tajam, aksen telemetri neon (cyan, emerald, amber, crimson), garis pemisah halus semi-transparan, tipografi monospace untuk data numerik, serta animasi pulse yang hidup.

## 2. Palet Warna (Color Palette)

| Nama Token | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| **Obsidian Black (Canvas)** | `#07090E` | Background layar utama & root body |
| **Surface Dark (Card)** | `#0D111A` | Background kartu, modul & container tabel |
| **Elevated Charcoal** | `#161F30` | Header kartu, hover state, input field |
| **Border Gridline** | `#1E2C42` | Garis batas, pemisah sel tabel, grid SVG |
| **Electric Cyan (Primary)**| `#00F5FF` | Indikator radar aktif, tombol aksi utama, link aktif |
| **Emerald Marine (Optimal)**| `#10B981` | Status en-route normal, suhu stabil, jalur hijau |
| **Amber Warning (Caution)** | `#F59E0B` | Keterlambatan, pelabuhan padat, batas free-days |
| **Crimson Hazard (Critical)**| `#EF4444` | Insiden darurat, suhu anomali, boikot rute, hold bea cukai |
| **Deep Violet (IoT/Special)**| `#8B5CF6` | Sensor cold-chain khusus, kargo farmasi, reefer mode |
| **Text Primary** | `#F1F5F9` | Judul, nilai metrik, label utama |
| **Text Secondary / Muted**| `#94A3B8` | Label sub-informasi, koordinat, keterangan unit |

## 3. Gaya Tipografi
- **Headings & Body**: `Inter`, `system-ui`, `sans-serif` untuk keterbacaan teks informasi.
- **Numbers & Telemetry**: Monospace (`ui-monospace`, `Geist Mono`, `Consolas`) untuk angka koordinat, kecepatan knot, TEU, waktu Zulu/UTC, dan nomor bill of lading.

## 4. Efek & Utility Khusus (di `globals.css`)
- **Radar Scan Pulse**: Animasi lingkaran berdenyut pada penanda kapal dan koordinat pelabuhan.
- **Cyber Glow**: `box-shadow: 0 0 15px rgba(0, 245, 255, 0.25)` untuk komponen aktif.
- **Thin Scrollbar**: Scrollbar ultra-tipis dengan warna track `#0D111A` dan thumb `#1E2C42`.
