# 💰 Dokumentasi Fitur Keuangan

## ✨ Fitur Baru yang Ditambahkan

### 1. 💵 Nominal Iuran Per Warga
- Setiap warga memiliki nominal iuran sendiri
- Pilihan: **Rp 50.000** atau **Rp 100.000**
- Nominal ditampilkan di tabel dengan badge warna:
  - 🟦 Biru = Rp 50.000
  - 🟪 Purple = Rp 100.000

### 2. 📊 Dashboard Keuangan
Dashboard menampilkan 3 kartu informasi:

#### 💰 Pemasukan Bulan Ini
- Total pemasukan dari warga yang sudah lunas
- Dihitung otomatis: `nominal_iuran × jumlah yang lunas`
- Warna: Hijau (Green)

#### 💸 Pengeluaran Bulan Ini  
- Total semua pengeluaran kas bulan berjalan
- Dijumlahkan dari form pengeluaran
- Warna: Merah (Red)

#### 🏦 Sisa Kas
- Sisa uang kas komplek
- Rumus: `Pemasukan - Pengeluaran`
- Warna: Biru (Blue)

### 3. ➕ Form Pengeluaran Kas
Admin bisa menambah pengeluaran dengan mengisi:
- **Keterangan**: Deskripsi pengeluaran (contoh: Bayar listrik, Perbaikan jalan)
- **Nominal**: Jumlah uang yang dikeluarkan
- **Bulan**: Bulan pengeluaran (default: bulan berjalan)

### 4. 📋 List Pengeluaran
- Menampilkan semua riwayat pengeluaran
- Diurutkan dari yang terbaru
- Bisa dihapus jika ada kesalahan input

### 5. 💾 Download Laporan Keuangan Excel
File Excel terpisah berisi 2 sheet:

**Sheet 1: Ringkasan Keuangan**
- Tabel per bulan (Jan - Des)
- Kolom: Bulan, Total Pemasukan, Total Pengeluaran, Sisa Kas
- Format currency (Rp)
- Color coding: Hijau (surplus), Merah (defisit)

**Sheet 2: Detail Pengeluaran**
- Daftar lengkap semua pengeluaran
- Kolom: Tanggal, Bulan, Keterangan, Nominal
- Format currency (Rp)

---

## 📂 Struktur Data

### File: `data/warga.json`
```json
{
  "id": 1,
  "no_rumah": "A-01",
  "nama": "Budi Santoso",
  "nominal_iuran": 50000,
  "status_Jan": "Lunas",
  "status_Feb": "Belum Bayar"
}
```

### File: `data/pengeluaran.json` (Baru)
```json
{
  "id": 1,
  "keterangan": "Bayar listrik komplek",
  "nominal": 250000,
  "bulan": "Jul",
  "tanggal": "2026-07-17T10:30:00.000Z"
}
```

---

## 🎯 Cara Menggunakan

### Untuk Admin:

#### 1. Menambah Warga Baru dengan Nominal
1. Login sebagai admin
2. Isi form "Tambah Rumah/Warga Baru"
3. Pilih nominal iuran: Rp 50.000 atau Rp 100.000
4. Klik "Daftarkan Rumah"

#### 2. Mengubah Nominal Iuran Warga
1. Klik tombol "Edit" pada warga yang ingin diubah
2. Pilih nominal baru dari dropdown
3. Klik "Simpan"

#### 3. Melihat Dashboard Keuangan
- Dashboard otomatis muncul di atas tabel
- Data real-time untuk bulan berjalan
- Refresh halaman untuk update data

#### 4. Menambah Pengeluaran
1. Klik tombol **"➕ Tambah Pengeluaran"**
2. Isi form:
   - Keterangan: "Bayar listrik komplek"
   - Nominal: 250000
   - Bulan: Jul (default bulan berjalan)
3. Klik "Simpan Pengeluaran"
4. Dashboard otomatis update

#### 5. Melihat Daftar Pengeluaran
1. Klik tombol **"📋 Lihat Pengeluaran"**
2. Modal akan menampilkan semua pengeluaran
3. Urutkan dari yang terbaru
4. Klik "🗑️ Hapus" untuk menghapus pengeluaran

#### 6. Download Laporan Keuangan
1. Klik tombol **"💾 Download Laporan Keuangan"**
2. File Excel akan terdownload otomatis
3. Nama file: `Laporan_Keuangan_Komplek_2026.xlsx`
4. Buka dengan Excel/LibreOffice

---

## 💡 Contoh Perhitungan

### Skenario Bulan Juli 2026:

**Data Warga:**
- A-01 (Budi): Rp 50.000 → Status: **Lunas** ✅
- A-02 (Siti): Rp 100.000 → Status: **Lunas** ✅
- A-03 (Hendra): Rp 50.000 → Status: **Belum Bayar** ❌

**Perhitungan Pemasukan:**
```
Budi:   50.000 (Lunas)
Siti:  100.000 (Lunas)
Hendra:      0 (Belum Bayar)
----------------------------
Total: 150.000
```

**Data Pengeluaran:**
- Bayar listrik: Rp 250.000
- Perbaikan jalan: Rp 500.000

**Perhitungan Pengeluaran:**
```
Listrik:        250.000
Perbaikan:      500.000
----------------------------
Total:          750.000
```

**Sisa Kas:**
```
Pemasukan:      150.000
Pengeluaran:   (750.000)
----------------------------
Sisa Kas:      (600.000)  ⚠️ Defisit
```

---

## 📊 Contoh Tampilan Dashboard

```
┌────────────────────────────────────────────────────┐
│ 💰 Pemasukan Bulan Ini                             │
│ Rp 150.000                                         │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ 💸 Pengeluaran Bulan Ini                           │
│ Rp 750.000                                         │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ 🏦 Sisa Kas                                        │
│ Rp -600.000                                        │
└────────────────────────────────────────────────────┘
```

---

## 🔐 Keamanan

- ✅ Semua fitur keuangan **hanya bisa diakses admin**
- ✅ Warga biasa tidak bisa lihat:
  - Nominal iuran
  - Dashboard keuangan
  - Form pengeluaran
  - Laporan keuangan
- ✅ Data pengeluaran tersimpan terpisah di `pengeluaran.json`

---

## 📁 File yang Dimodifikasi/Ditambah

### File Baru:
1. ✅ `data/pengeluaran.json` - Database pengeluaran
2. ✅ `FITUR_KEUANGAN.md` - Dokumentasi ini

### File Dimodifikasi:
1. ✅ `data/warga.json` - Tambah field `nominal_iuran`
2. ✅ `server.js` - Tambah endpoint dan fungsi keuangan
3. ✅ `views/index.ejs` - Tambah UI dashboard dan modal

---

## 🎨 Tombol Baru di Interface

### Header (Admin Only):
- 🔵 **📊 Unduh Lengkap** - Download riwayat iuran
- 🟡 **📜 Riwayat Bulan** - Lihat data bulan lalu

### Dashboard Keuangan (Admin Only):
- 🔴 **➕ Tambah Pengeluaran** - Input pengeluaran baru
- 🟠 **📋 Lihat Pengeluaran** - Daftar semua pengeluaran
- 🟣 **💾 Download Laporan Keuangan** - Excel terpisah

---

## ⚠️ Catatan Penting

1. **Nominal Iuran Warga Lama**
   - Warga yang ditambahkan sebelum update ini akan default Rp 50.000
   - Admin bisa edit manual untuk mengubah nominal

2. **Data Pengeluaran Terpisah**
   - File `pengeluaran.json` terpisah dari `warga.json`
   - Download "Unduh Lengkap" → hanya data iuran
   - Download "Laporan Keuangan" → hanya data keuangan

3. **Perhitungan Real-time**
   - Dashboard otomatis hitung saat halaman di-load
   - Refresh halaman untuk update data terbaru

4. **Backup Data**
   - Backup `warga.json` dan `pengeluaran.json` secara berkala
   - Data tidak bisa di-recover jika terhapus

---

## 🚀 Update Selanjutnya (Roadmap)

Fitur yang bisa ditambahkan:
- [ ] Grafik/chart keuangan per bulan
- [ ] Export PDF laporan keuangan
- [ ] Notifikasi email untuk warga yang belum bayar
- [ ] Dashboard kumulatif (total kas dari Jan-Des)
- [ ] Filter pengeluaran by kategori
- [ ] Bukti transfer/foto untuk pengeluaran

---

**Versi:** 3.0.0  
**Update:** Juli 2026  
**Fitur Baru:** Manajemen Keuangan Komplek
