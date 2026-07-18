# 🏘️ Sistem Iuran Warga Komplek

Aplikasi web untuk mengelola dan monitoring pembayaran iuran bulanan warga komplek perumahan.

## ✨ Fitur Utama

### 👥 Untuk Semua Pengguna (Warga & Admin)
- ✅ Melihat status iuran bulan berjalan
- 📊 Download laporan Excel lengkap (semua bulan)
- 🔍 Interface yang responsive dan user-friendly

### 🔐 Khusus Admin
- ➕ Tambah data rumah/warga baru
- ✏️ Edit nomor rumah dan nama pemilik
- 🗑️ Hapus data rumah
- 🔄 Ubah status pembayaran (Lunas/Belum Bayar)
- 📜 **Lihat riwayat data bulan-bulan lalu**
- 📥 **Download laporan per bulan tertentu**

## 🚀 Cara Menjalankan

### Instalasi
```bash
npm install
```

### Menjalankan Aplikasi
```bash
npm start
```

Aplikasi akan berjalan di: **http://localhost:3000**

## 🔑 Login Admin

**Password Default:** `masahiro123`

_Untuk mengubah password, edit variabel `PASSWORD_ADMIN` di file `server.js`_

## 📂 Struktur Data

Data warga disimpan di `data/warga.json` dengan format:

```json
{
  "id": 1,
  "no_rumah": "A-01",
  "nama": "Budi Santoso",
  "status_Jan": "Lunas",
  "status_Feb": "Belum Bayar",
  "status_Jul": "Belum Bayar"
}
```

## 💡 Cara Kerja Sistem

### Tampilan Bulan Berjalan
- Sistem otomatis mendeteksi bulan berjalan
- Hanya bulan berjalan yang ditampilkan di halaman utama
- Contoh: Di bulan Juli 2026, hanya kolom "Iuran Jul 2026" yang muncul

### Penyimpanan Data Historis
- **Semua data bulan lalu tetap tersimpan** di database lokal (`warga.json`)
- Data historis tidak hilang atau terhapus
- Admin bisa mengakses riwayat kapan saja

### Fitur Riwayat Bulan (Admin)
1. Klik tombol **"📜 Riwayat Bulan"** di header
2. Pilih bulan yang ingin dilihat (Jan, Feb, Mar, dll)
3. Lihat tabel lengkap dengan statistik:
   - Total warga yang sudah lunas
   - Total warga yang belum bayar
   - Persentase pembayaran
4. Download Excel khusus untuk bulan tersebut

## 📊 Download Excel

### 1. Download Lengkap
- Tombol: **"📊 Unduh Lengkap"**
- Berisi: Semua bulan yang ada di database
- Akses: Warga & Admin

### 2. Download Per Bulan (Admin Only)
- Lokasi: Di dalam modal "Riwayat Bulan"
- Tombol: **"📥 Download [Nama Bulan]"**
- Berisi: Data bulan tertentu saja
- File: `Laporan_Iuran_Jul_2026.xlsx`

## 🎯 Contoh Penggunaan

### Skenario 1: Admin Cek Riwayat
1. Login sebagai admin
2. Klik "📜 Riwayat Bulan"
3. Pilih bulan "Jun" untuk melihat data Juni
4. Lihat statistik: 2 lunas, 1 belum bayar
5. Klik "📥 Download Jun" jika perlu laporan

### Skenario 2: Warga Lihat Status
1. Buka website tanpa login
2. Lihat status iuran bulan berjalan
3. Download Excel lengkap untuk arsip pribadi

### Skenario 3: Admin Update Status
1. Login sebagai admin
2. Ubah status dari "Belum Bayar" → "Lunas"
3. Data otomatis tersimpan di database

## 🛠️ Teknologi yang Digunakan

- **Backend:** Node.js + Express.js
- **View Engine:** EJS
- **Session:** express-session
- **Excel Export:** ExcelJS
- **Styling:** Tailwind CSS (via CDN)

## 📁 Struktur Folder

```
iuran_komplek/
├── data/
│   └── warga.json          # Database lokal (JSON)
├── views/
│   └── index.ejs           # Template halaman utama
├── node_modules/           # Dependencies
├── package.json            # Project config
├── server.js               # Server & routing
└── README.md               # Dokumentasi
```

## 🔄 Migrasi Bulan Baru

Sistem otomatis mendeteksi bulan berjalan. Ketika bulan berganti:

1. ✅ Bulan lama otomatis menjadi "historis"
2. ✅ Bulan baru ditampilkan di halaman utama
3. ✅ Semua warga otomatis mendapat status "Belum Bayar" untuk bulan baru
4. ✅ Data bulan lama tetap tersimpan dan bisa diakses via "Riwayat Bulan"

**Tidak ada action manual yang diperlukan!**

## ⚙️ Kustomisasi

### Ubah Password Admin
Edit di `server.js` baris 10:
```javascript
const PASSWORD_ADMIN = 'password_baru_anda';
```

### Ubah Port
Edit di `server.js` baris 9:
```javascript
const PORT = 8080; // Ganti dengan port yang diinginkan
```

## 🐛 Troubleshooting

### Server Tidak Bisa Jalan
```bash
# Pastikan dependencies terinstall
npm install

# Cek apakah port 3000 sedang dipakai
# Windows: netstat -ano | findstr :3000
```

### Data Tidak Tersimpan
- Pastikan folder `data/` ada dan writable
- Cek permission file `warga.json`

### Excel Tidak Bisa Didownload
- Pastikan package `exceljs` terinstall
- Cek console browser untuk error

## 📝 License

MIT License - Bebas digunakan untuk keperluan pribadi maupun komersial

## 👨‍💻 Pengembang

Dikembangkan untuk memudahkan pengelolaan iuran warga komplek.

---

**Versi:** 2.0.0  
**Update Terakhir:** Juli 2026  
**Fitur Baru:** Riwayat Bulan & Download Per Bulan
