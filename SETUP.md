# 🎬 Casting Studio — Setup Guide

Panduan lengkap dari nol sampai live di internet. **Gratis total.**

---

## Arsitektur Final

```
Google Form (peserta daftar)
      ↓ otomatis
Google Sheets (data mentah)
      ↓ sync manual/otomatis via tombol
Express Backend (Railway — gratis)
      ↓
Supabase PostgreSQL (database — gratis)
      ↑
React Frontend (Vercel — gratis)

Media (foto/video) → Synology Drive → link di-paste ke form/app
```

---

## Langkah 1 — Supabase (Database)

1. Buka [supabase.com](https://supabase.com) → **Start for free**
2. Buat project baru, pilih region **Southeast Asia (Singapore)**
3. Masuk ke **SQL Editor** → paste isi file `supabase-schema.sql` → **Run**
4. Buka **Project Settings → API**:
   - Copy **Project URL** → ini `SUPABASE_URL`
   - Copy **service_role** secret key → ini `SUPABASE_SERVICE_KEY`

---

## Langkah 2 — Google Cloud & Sheets API

### 2a. Aktifkan Google Sheets API

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru → nama bebas (mis. "casting-app")
3. Di search bar atas ketik **"Google Sheets API"** → Enable
4. Buka **APIs & Services → Credentials → Create Credentials → Service Account**
5. Isi nama service account → Create → Done
6. Klik service account yang baru dibuat → tab **Keys** → **Add Key → JSON**
7. File JSON akan terdownload. Ambil dua nilai dari file ini:
   - `client_email` → ini `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → ini `GOOGLE_PRIVATE_KEY`

### 2b. Google Form baru (dengan field foto & video)

Buat Google Form dengan urutan pertanyaan **persis** ini:

| No | Pertanyaan | Tipe |
|----|-----------|------|
| 1 | Nama Lengkap | Short answer |
| 2 | Tempat / Tanggal Lahir | Short answer |
| 3 | Jenis Kelamin | Dropdown: Perempuan, Laki-laki |
| 4 | Alamat Email | Short answer |
| 5 | Nomor Telepon | Short answer |
| 6 | Alamat Tinggal Saat Ini | Short answer |
| 7 | Pendidikan Terakhir | Short answer |
| 8 | Tinggi Badan (cm) | Short answer |
| 9 | Berat Badan (kg) | Short answer |
| 10 | Warna Rambut | Short answer |
| 11 | Warna Mata | Short answer |
| 12 | Ukuran Baju | Short answer |
| 13 | Ukuran Sepatu | Short answer |
| 14 | Pengalaman Akting / Voice Over | Paragraph |
| 15 | Daftar Pengalaman Akting | Paragraph |
| 16 | Daftar Pengalaman Voice Over | Paragraph |
| 17 | Bahasa yang Dikuasai | Short answer |
| 18 | Keterampilan Khusus | Short answer |
| 19 | Link Portofolio / Reel | Short answer |
| 20 | Profil Media Sosial | Short answer |
| **21** | **Link Foto (Synology Drive)** | Short answer |
| **22** | **Link Video Casting (Synology Drive / YouTube)** | Short answer |

### 2c. Hubungkan Form ke Sheets & beri akses service account

1. Di Google Form → klik tab **Responses → Link to Sheets** → buat spreadsheet baru
2. Spreadsheet baru terbuka → **Share** → paste `GOOGLE_SERVICE_ACCOUNT_EMAIL` → role **Viewer** → Send
3. Copy **Spreadsheet ID** dari URL:
   `https://docs.google.com/spreadsheets/d/**SPREADSHEET_ID**/edit`
   → ini `GOOGLE_SHEET_ID`

---

## Langkah 3 — Synology Drive (Penyimpanan Media)

1. Di Synology NAS, buka **Package Center → install Synology Drive Server**
2. Buka **Synology Drive Admin Console → Team Folder → Create** folder bernama `casting-media`
3. Set permission: **Read & Write** untuk akun admin
4. Untuk share link publik: klik kanan file/folder → **Share → Copy link**

**Cara kerja:** Peserta casting upload foto/video ke Google Drive atau YouTube pribadi mereka, lalu paste linknya di field no. 21 & 22 di Google Form. Synology Drive Anda bisa digunakan untuk **backup** atau penyimpanan internal admin saja.

---

## Langkah 4 — Setup & Jalankan Lokal

```bash
# Clone / buka folder project
cd casting-app

# Install semua dependency
npm run install:all

# Setup environment variables server
cp server/.env.example server/.env
# Edit server/.env dengan nilai dari Langkah 1, 2, 3

# Setup environment variables client (opsional untuk dev)
cp client/.env.example client/.env

# Jalankan development (frontend + backend sekaligus)
npm run dev
```

Buka browser: `http://localhost:5173`

### Buat akun admin pertama

```bash
curl -X POST http://localhost:3001/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password_kuat_anda","setup_key":"isi_SETUP_KEY_dari_env"}'
```

---

## Langkah 5 — Deploy ke Internet

### 5a. Push ke GitHub

```bash
git init
git add .
git commit -m "initial commit"
# Buat repo di github.com, lalu:
git remote add origin https://github.com/username/casting-app.git
git push -u origin main
```

### 5b. Deploy Backend ke Railway

1. Buka [railway.app](https://railway.app) → Login with GitHub
2. **New Project → Deploy from GitHub repo** → pilih `casting-app`
3. **Add Service → pilih folder `server`**
4. Di tab **Variables**, tambahkan semua isi `server/.env`
5. Di tab **Settings → Root Directory** → isi `server`
6. Railway akan auto-deploy. Copy **public URL** → mis. `https://casting-app-production.up.railway.app`

### 5c. Deploy Frontend ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login with GitHub
2. **New Project → Import** repo `casting-app`
3. **Root Directory** → `client`
4. **Environment Variables** → tambahkan:
   ```
   VITE_API_URL = https://casting-app-production.up.railway.app/api
   ```
5. Deploy → Vercel akan memberikan URL publik, mis. `https://casting-studio.vercel.app`

### 5d. Update CORS di Railway

Di Railway Variables, update:
```
CLIENT_URL = https://casting-studio.vercel.app
```

---

## Cara Pakai Sehari-hari

### Saat ada casting baru:
1. Share link Google Form ke calon talent
2. Tunggu respons masuk ke Google Sheets otomatis
3. Di app → klik **Sync Sheets** (tombol kanan atas)
4. Data baru muncul di daftar talent

### Kelola talent:
- **Filter** sidebar kiri: usia, gender, tinggi, berat, bahasa, status, project
- **Klik talent** → lihat detail lengkap
- **Ubah status** langsung di detail: Baru → Dipanggil → Lolos / Tidak Lolos
- **Catatan admin** tersimpan per talent
- **Assign ke project** untuk tracking riwayat

### Kelola project:
- **Projects** (tombol atas) → buat project baru
- Assign talent dari halaman detail talent
- Centang "Terpilih" untuk talent yang masuk final

---

## Biaya Bulanan

| Service | Gratis s/d |
|---------|-----------|
| Supabase | 500MB database, tidak expire |
| Google Sheets API | 300 req/menit, gratis |
| Railway | $5 free credit/bulan (cukup untuk low-traffic) |
| Vercel | Unlimited untuk hobby projects |
| Synology | Sudah punya |
| **Total** | **~Rp 0** |

> Railway free credit $5/bulan biasanya cukup untuk backend yang jarang diakses.
> Jika ingin benar-benar gratis, bisa host backend di Render.com (free tier, cold start ~30 detik).

---

## Struktur Folder

```
casting-app/
├── client/                  ← React + Vite + TypeScript
│   └── src/
│       ├── components/      ← UI components
│       ├── pages/           ← Route pages
│       ├── hooks/           ← React Query hooks
│       ├── lib/             ← API client (axios)
│       ├── store/           ← Zustand state
│       └── types/           ← TypeScript types
├── server/                  ← Express.js
│   └── src/
│       ├── routes/          ← auth, talents, projects, sync
│       ├── middleware/      ← JWT auth
│       └── lib/             ← Supabase client, Sheets client
├── supabase-schema.sql      ← Run ini di Supabase SQL Editor
└── SETUP.md                 ← File ini
```
