# 📜 Fitur Riwayat Data Iuran untuk User Warga

## 🎯 Deskripsi Fitur

Fitur ini memungkinkan **user warga (non-admin)** untuk melihat riwayat data pembayaran iuran dari **Januari sampai Desember** secara transparan. Ini adalah implementasi transparansi keuangan yang memungkinkan warga melihat status pembayaran seluruh warga komplek.

---

## ✨ Fitur Utama

### 1. **Tombol Akses untuk Warga**
- Tombol **"📜 Riwayat Data Iuran"** muncul di header untuk semua user (warga & admin)
- Warga: membuka modal read-only (tidak bisa edit)
- Admin: membuka modal dengan akses edit

### 2. **Modal Riwayat untuk Warga**
Modal khusus warga dengan fitur:

#### a. **Filter Bulan**
- Pilihan bulan dari Januari - Desember
- Bulan berjalan ditandai dengan warna khusus (highlight indigo)
- Tombol interaktif untuk switch antar bulan

#### b. **Tabel Data Per Bulan**
- Kolom: No. Rumah, Nama Warga, Status Pembayaran
- Status dalam bentuk badge warna:
  - ✓ Lunas → Hijau (`bg-green-100`)
  - ✗ Belum Bayar → Merah (`bg-red-100`)
  - `-` → Abu-abu (tidak ada data)
- **Read-only** untuk warga (tidak ada dropdown edit)

#### c. **Fitur Pencarian**
- Search bar untuk cari nomor rumah atau nama warga
- Real-time filtering saat mengetik
- Menampilkan jumlah hasil pencarian: "Ditemukan X data"

#### d. **Statistik Ringkas**
- Total Lunas (hijau) vs Belum Bayar (merah)
- Progress bar tingkat pembayaran (persentase)
- Update otomatis sesuai data bulan yang dipilih

#### e. **Info Transparansi**
- Box informasi biru dengan penjelasan fitur
- Pesan: data real-time, hubungi admin jika ada perbedaan

---

## 🔐 Perbedaan Admin vs Warga

| Fitur | Admin | Warga |
|-------|-------|-------|
| **Akses Modal** | ✅ (Edit mode) | ✅ (Read-only) |
| **Lihat Semua Bulan** | ✅ | ✅ |
| **Edit Status Bayar** | ✅ Dropdown edit | ❌ Badge read-only |
| **Download Excel** | ✅ Per bulan | ❌ Tidak ada |
| **Cari/Filter Data** | ✅ | ✅ |
| **Lihat Statistik** | ✅ | ✅ |

---

## 📱 Cara Penggunaan (User Warga)

### Langkah 1: Akses Fitur
1. Buka website: `http://localhost:3000`
2. **Tanpa login admin**, klik tombol **"📜 Riwayat Data Iuran"** di header

### Langkah 2: Pilih Bulan
1. Modal akan terbuka dengan daftar bulan (Jan - Des)
2. Klik salah satu bulan yang ingin dilihat
3. Bulan berjalan akan ditandai dengan label **(Berjalan)**

### Langkah 3: Lihat Data
1. Tabel akan menampilkan semua warga dengan status pembayaran
2. Lihat statistik: Total Lunas, Belum Bayar, Progress Bar

### Langkah 4: Cari Warga Tertentu (Opsional)
1. Gunakan search bar di atas tabel
2. Ketik nomor rumah (contoh: `A-01`) atau nama warga
3. Hasil pencarian akan filter otomatis

### Langkah 5: Tutup Modal
- Klik tombol **✕** di pojok kanan atas
- Atau klik area gelap di luar modal

---

## 💡 Manfaat Fitur Ini

### Untuk Warga:
- ✅ **Transparansi Penuh**: Lihat status pembayaran seluruh warga
- ✅ **Cek Riwayat**: Lihat data bulan-bulan sebelumnya
- ✅ **Self-Service**: Tidak perlu tanya admin untuk cek data
- ✅ **Real-Time**: Data update otomatis saat admin ubah status

### Untuk Admin:
- ✅ **Mengurangi Pertanyaan**: Warga bisa cek sendiri
- ✅ **Akuntabilitas**: Data terbuka untuk semua warga
- ✅ **Kredibilitas**: Meningkatkan kepercayaan warga

---

## 🎨 Desain & UX

### Warna & Badge
- **Hijau** → Status Lunas (positif, aman)
- **Merah** → Belum Bayar (perlu tindakan)
- **Abu-abu** → Tidak ada data (netral)
- **Indigo** → Bulan berjalan (highlight)

### Responsif Mobile
- Modal menyesuaikan ukuran layar
- Scroll horizontal untuk tabel di mobile
- Tombol touch-friendly (min 44px)
- Font size 16px untuk prevent zoom iOS

### Animasi & Transisi
- Fade-in saat modal dibuka
- Hover effect pada tombol & tabel row
- Progress bar dengan transisi smooth

---

## 🔧 Implementasi Teknis

### File yang Dimodifikasi:
- `views/index.ejs` → Tambah modal & JavaScript

### JavaScript Functions:
```javascript
// Fungsi untuk Warga (non-admin)
bukaRiwayatWarga()           // Buka modal
tutupRiwayatWarga()          // Tutup modal
tampilkanBulanWarga(bulan)   // Switch ke bulan tertentu
sembunyikanSemuaTabelWarga() // Hide semua tabel
filterModalTableWarga(bulan) // Search/filter dalam modal
```

### EJS Logic:
```ejs
<% if (!isAdmin) { %>
    <!-- Modal khusus warga (read-only) -->
<% } %>

<% if (isAdmin) { %>
    <!-- Modal khusus admin (editable) -->
<% } %>
```

### Data Flow:
1. Server kirim data: `warga`, `semuaBulan`, `isAdmin`
2. EJS render modal berdasarkan role user
3. JavaScript handle interaksi (klik, search, filter)
4. Modal close/open tanpa reload halaman

---

## 📊 Contoh Tampilan Modal

```
┌─────────────────────────────────────────────────┐
│  📜 Riwayat Data Iuran Saya             [✕]    │
│  Data pembayaran iuran Anda dari Jan - Des     │
├─────────────────────────────────────────────────┤
│  Pilih Bulan:                                   │
│  [Jan] [Feb] [Mar] ... [Jul*] ... [Des]       │
│                                                 │
│  🔍 Cari nomor rumah atau nama warga...        │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │ No. Rumah │ Nama Warga  │ Status     │      │
│  ├──────────────────────────────────────┤      │
│  │ A-01      │ Budi        │ ✓ Lunas    │      │
│  │ A-02      │ Siti        │ ✗ Belum    │      │
│  │ A-03      │ Hendra      │ ✓ Lunas    │      │
│  └──────────────────────────────────────┘      │
│                                                 │
│  [Total Lunas: 2/3]  [Belum Bayar: 1/3]       │
│  [========66%===============>          ]       │
│                                                 │
│  💡 Transparansi: Anda dapat melihat data      │
│     pembayaran iuran semua warga komplek       │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Testing Checklist

### Test sebagai Warga (Non-Admin):
- [ ] Buka website tanpa login admin
- [ ] Klik tombol "📜 Riwayat Data Iuran"
- [ ] Modal terbuka dengan judul "Riwayat Data Iuran Saya"
- [ ] Klik berbagai bulan (Jan, Feb, Jul, dll)
- [ ] Tabel berubah sesuai bulan yang dipilih
- [ ] Status tampil sebagai badge (tidak ada dropdown)
- [ ] Coba search nama/nomor rumah
- [ ] Lihat statistik & progress bar update
- [ ] Tutup modal dengan tombol ✕
- [ ] Tidak ada tombol Download Excel

### Test sebagai Admin:
- [ ] Login dengan password: `masahiro123`
- [ ] Klik tombol "📜 Riwayat Data Iuran"
- [ ] Modal berbeda dari warga (ada dropdown edit)
- [ ] Bisa ubah status pembayaran bulan lalu
- [ ] Ada tombol Download Excel per bulan

---

## 🛠️ Troubleshooting

### Modal tidak muncul
- **Cek**: Browser console untuk error JavaScript
- **Solusi**: Refresh halaman (Ctrl+F5)

### Data tidak muncul
- **Cek**: File `data/warga.json` ada data
- **Solusi**: Pastikan field `status_Jan`, `status_Feb`, dll ada

### Search tidak berfungsi
- **Cek**: Apakah ada error di console
- **Solusi**: Pastikan `data-rumah` dan `data-nama` attribute ada

### Statistik salah
- **Cek**: Data di `warga.json` format benar
- **Solusi**: Refresh halaman untuk reload data

---

## 📝 Catatan Penting

1. **Data Real-Time**: Modal membaca data langsung dari database JSON saat halaman dimuat
2. **Tidak Ada Cache**: Setiap kali buka website, data ter-update dari server
3. **Read-Only untuk Warga**: Warga tidak bisa edit, hanya lihat
4. **Transparansi Penuh**: Semua warga bisa lihat data warga lain (sesuai prinsip transparansi)
5. **Mobile Friendly**: Modal responsive untuk Android & iOS

---

## 📞 Untuk Warga

Jika Anda menemukan:
- Status pembayaran Anda salah
- Data tidak sesuai bukti transfer
- Nama atau nomor rumah tidak tepat

**Hubungi Admin** untuk update data. Warga tidak bisa edit sendiri untuk menjaga integritas data.

---

**Dokumentasi dibuat:** Juli 2026  
**Versi Sistem:** 1.0  
**Developer:** iuran_komplek team
