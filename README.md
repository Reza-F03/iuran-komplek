# 🏘️ Aplikasi Monitoring Pembayaran Iuran Komplek Masihiro Residence

Aplikasi web untuk monitoring dan pengelolaan iuran warga komplek Masihiro Residence.

## 📋 Fitur Utama

### Untuk Admin:
- ✅ Dashboard keuangan real-time (5 kartu: Pemasukan Iuran, Pemasukan Lain, Pengeluaran, Kas/Bulan, Total Kas)
- ✅ Manajemen data warga (Tambah, Edit, Hapus)
- ✅ Update status pembayaran iuran (Lunas/Belum Bayar)
- ✅ Manajemen pemasukan lain-lain (sewa, denda, sumbangan)
- ✅ Manajemen pengeluaran kas
- ✅ Riwayat data iuran per bulan (Jan-Des)
- ✅ Laporan keuangan lengkap dengan total kumulatif
- ✅ Download Excel (3 sheet: Ringkasan, Pengeluaran, Pemasukan Lain)
- ✅ Filter & search data warga

### Untuk Warga:
- ✅ Lihat status iuran bulan berjalan
- ✅ Riwayat data iuran semua bulan
- ✅ Riwayat keuangan komplek (transparansi penuh)
- ✅ Riwayat pengeluaran kas
- ✅ Download laporan keuangan Excel
- ✅ Filter & search data

## 💰 Variasi Nominal Iuran

- **Rp 30.000** - Rumah kecil/kost (Badge Teal)
- **Rp 50.000** - Rumah sedang (Badge Blue)
- **Rp 100.000** - Rumah besar (Badge Purple)

## 🚀 Tech Stack

- **Backend:** Node.js + Express.js
- **View Engine:** EJS
- **Database:** JSON File (warga.json, pengeluaran.json, pemasukan_lain.json)
- **Excel Export:** ExcelJS
- **CSS Framework:** Tailwind CSS (via CDN)
- **Session:** express-session

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/iuran-komplek.git
cd iuran-komplek
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Application

```bash
npm start
```

Server akan berjalan di: http://localhost:3000

## 🔐 Login Admin

**Default Password:** `masahiro123`

## 📂 Struktur Folder

```
iuran_komplek/
├── data/
│   ├── warga.json              # Data warga & status iuran
│   ├── pengeluaran.json        # Data pengeluaran kas
│   └── pemasukan_lain.json     # Data pemasukan lain-lain
├── views/
│   └── index.ejs               # Main template
├── node_modules/
├── .gitignore
├── package.json
├── server.js                   # Main server file
├── vercel.json                 # Vercel config
└── README.md
```

## 🌐 Deploy ke Vercel

### Via GitHub (Recommended)

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/iuran-komplek.git
   git push -u origin main
   ```

2. **Connect ke Vercel:**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub
   - Click "Import Project"
   - Pilih repository `iuran-komplek`
   - Click "Deploy"

3. **Environment Variables (Optional):**
   - Tidak ada env variable yang perlu diset
   - Password admin hardcoded di `server.js`

### Deploy Manual

```bash
npm install -g vercel
vercel
```

## ⚙️ Configuration

### Ubah Password Admin

Edit file `server.js`:

```javascript
const PASSWORD_ADMIN = 'password_baru_anda';
```

### Ubah Port (Local Development)

Edit file `server.js`:

```javascript
const PORT = 3000; // Ganti dengan port yang diinginkan
```

## 📊 Database Schema

### warga.json

```json
{
  "id": 1,
  "no_rumah": "B-01",
  "nama": "Agung",
  "nominal_iuran": 50000,
  "status_Jan": "Lunas",
  "status_Feb": "Belum Bayar",
  ...
}
```

### pengeluaran.json

```json
{
  "id": 1,
  "keterangan": "Bayar listrik",
  "nominal": 500000,
  "bulan": "Jul",
  "tanggal": "2026-07-17T10:30:00.000Z"
}
```

### pemasukan_lain.json

```json
{
  "id": 1,
  "keterangan": "Sewa fasilitas",
  "nominal": 500000,
  "bulan": "Jul",
  "tanggal": "2026-07-17T10:30:00.000Z"
}
```

## 🎨 Color Scheme

- **Primary:** Indigo (#4F46E5)
- **Success:** Green/Emerald
- **Warning:** Amber/Yellow
- **Danger:** Red/Rose
- **Info:** Blue/Cyan
- **Pemasukan Lain:** Teal

## 📱 Mobile Responsive

✅ Fully responsive untuk semua device:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

Optimasi khusus:
- Touch targets min 44px
- Input font-size 16px (prevent iOS zoom)
- Horizontal scroll untuk tabel lebar
- Smooth scrolling

## 🔒 Security Notes

⚠️ **PENTING untuk Production:**

1. **Ganti Password Admin** yang ada di `server.js`
2. **Gunakan Environment Variables** untuk password:
   ```javascript
   const PASSWORD_ADMIN = process.env.ADMIN_PASSWORD || 'default123';
   ```
3. **Gunakan Database Proper** (PostgreSQL, MySQL, MongoDB) untuk production
4. **Implementasi HTTPS** (Vercel otomatis support HTTPS)
5. **Rate Limiting** untuk prevent brute force
6. **Input Validation** untuk semua form

## 🐛 Troubleshooting

### Port sudah digunakan

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Module not found

```bash
rm -rf node_modules
npm install
```

### Vercel deployment error

- Cek `vercel.json` sudah benar
- Pastikan `package.json` ada script `"start": "node server.js"`
- Cek logs di Vercel dashboard

## 📞 Support

Jika ada pertanyaan atau bug, hubungi:
- **Developer:** Reza
- **Email:** [your-email@example.com]
- **Komplek:** Masihiro Residence

## 📄 License

© 2026 Reza - Komplek Masihiro Residence. All rights reserved.

---

**Version:** 2.2  
**Last Update:** Juli 2026  
**Status:** Production Ready ✅
