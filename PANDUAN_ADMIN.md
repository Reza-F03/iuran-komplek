# 📖 Panduan Admin - Sistem Iuran Komplek

## 🔐 Login Admin

1. Buka website di browser: `http://localhost:3000`
2. Masukkan password di kotak "Password Admin..." 
3. Klik "Masuk Admin"
4. Password default: `masahiro123`

---

## 📜 Cara Melihat Riwayat Bulan Lalu

### Langkah-langkah:

1. **Login sebagai Admin** terlebih dahulu
2. Klik tombol **"📜 Riwayat Bulan"** di bagian atas
3. Modal akan muncul menampilkan semua bulan yang tersimpan
4. **Klik bulan** yang ingin dilihat (contoh: "Jun", "Jan", dll)
5. Sistem akan menampilkan:
   - ✅ Tabel lengkap data warga bulan tersebut
   - 📊 Statistik total lunas dan belum bayar
   - 📈 Progress bar persentase pembayaran

### Fitur di Modal Riwayat:

#### 1️⃣ Tombol Bulan
- **Warna Biru dengan border** = Bulan berjalan (aktif)
- **Warna Abu-abu** = Bulan historis
- Klik bulan mana saja untuk melihat datanya

#### 2️⃣ Tabel Data
Menampilkan:
- Nomor Rumah
- Nama Warga
- Status (Lunas ✓ / Belum Bayar ✗ / Tidak Ada Data)

#### 3️⃣ Statistik Ringkas
- **Kotak Hijau**: Total yang sudah lunas
- **Kotak Merah**: Total yang belum bayar
- **Progress Bar**: Visualisasi persentase pembayaran

#### 4️⃣ Download Per Bulan
- Tombol **"📥 Download [Nama Bulan]"** di kanan atas tabel
- File Excel akan otomatis terdownload
- Format nama file: `Laporan_Iuran_Jul_2026.xlsx`

---

## 📥 Download Data

### A. Download Lengkap (Semua Bulan)
1. Klik tombol **"📊 Unduh Lengkap"** di header
2. File Excel berisi semua bulan akan terdownload
3. Nama file: `Laporan_Iuran_Komplek_Lengkap.xlsx`

### B. Download Per Bulan Tertentu
1. Buka modal **"📜 Riwayat Bulan"**
2. Pilih bulan yang diinginkan
3. Klik **"📥 Download [Bulan]"** di tabel yang muncul
4. File Excel hanya bulan tersebut akan terdownload

---

## ➕ Menambah Warga Baru

1. Login sebagai Admin
2. Isi form **"🏠 Tambah Rumah/Warga Baru"**:
   - Nomor Rumah (contoh: B-12)
   - Nama Lengkap Pemilik
3. Klik **"+ Daftarkan Rumah"**
4. Warga baru akan muncul di tabel dengan status "Belum Bayar" untuk bulan berjalan

---

## ✏️ Edit Data Warga

1. Cari warga yang ingin diedit di tabel
2. Klik tombol **"Edit"** di kolom Tindakan
3. Baris akan berubah menjadi form input
4. Ubah Nomor Rumah atau Nama
5. Klik **"Simpan"** untuk menyimpan
6. Klik **"Batal"** untuk membatalkan

---

## 🔄 Ubah Status Pembayaran

### Cara Cepat (Auto-save):
1. Pilih dropdown status di kolom "Iuran [Bulan]"
2. Ubah dari "Belum Bayar" ke "Lunas" (atau sebaliknya)
3. Data otomatis tersimpan (tidak perlu klik tombol)

---

## 🗑️ Hapus Data Warga

1. Cari warga yang ingin dihapus
2. Klik tombol **"Hapus"** di kolom Tindakan
3. Konfirmasi popup akan muncul
4. Klik **OK** untuk menghapus
5. Data akan terhapus permanen dari database

⚠️ **Perhatian**: Data yang dihapus tidak bisa dikembalikan!

---

## 🔄 Cara Kerja Sistem

### Bulan Berjalan
- Sistem otomatis mendeteksi bulan sekarang
- Hanya bulan berjalan yang ditampilkan di halaman utama
- **Juli 2026** → Hanya kolom "Iuran Jul 2026" yang muncul

### Bulan Berganti
Ketika bulan berganti (contoh: Juli → Agustus):
1. ✅ Kolom otomatis berubah menjadi "Iuran Agu 2026"
2. ✅ Semua status diset "Belum Bayar" untuk bulan baru
3. ✅ Data Juli tetap tersimpan dan bisa diakses via "Riwayat Bulan"

**Tidak perlu action manual, semua otomatis!**

---

## 📊 Contoh Kasus Penggunaan

### Kasus 1: Cek Siapa yang Belum Bayar Bulan Lalu
1. Klik "📜 Riwayat Bulan"
2. Pilih bulan "Jun"
3. Lihat baris dengan badge merah "✗ Belum Bayar"
4. Hubungi warga yang belum bayar
5. Download Excel Jun untuk dokumentasi

### Kasus 2: Buat Laporan Bulanan
1. Akhir bulan Juli, klik "📜 Riwayat Bulan"
2. Pilih bulan "Jul"
3. Lihat statistik: "2 Lunas, 1 Belum Bayar"
4. Klik "📥 Download Jul"
5. Excel siap untuk dilaporkan ke ketua RT/RW

### Kasus 3: Warga Bayar Iuran
1. Warga datang bayar iuran bulan Juli
2. Admin login dan cari nama warga di tabel
3. Ubah dropdown dari "Belum Bayar" → "Lunas"
4. Status otomatis tersimpan
5. Warga bisa lihat statusnya berubah hijau

---

## 🎯 Tips & Trik

### ✅ Do's (Yang Boleh)
- ✅ Gunakan modal Riwayat untuk cek data bulan lalu
- ✅ Download Excel per bulan untuk laporan spesifik
- ✅ Download Excel lengkap untuk backup berkala
- ✅ Edit data warga jika ada kesalahan input
- ✅ Logout setelah selesai menggunakan

### ❌ Don'ts (Yang Jangan)
- ❌ Jangan edit file `warga.json` manual (gunakan sistem)
- ❌ Jangan hapus data sembarangan tanpa konfirmasi
- ❌ Jangan share password admin ke warga biasa
- ❌ Jangan lupa logout dari komputer publik

---

## 🚨 Troubleshooting

### Tombol "Riwayat Bulan" Tidak Muncul
- Pastikan Anda sudah login sebagai Admin
- Tombol hanya muncul untuk Admin, tidak untuk Warga biasa

### Modal Tidak Muncul
- Coba refresh halaman (F5)
- Cek apakah JavaScript di browser tidak diblock

### Data Bulan Lalu Tidak Muncul
- Pastikan data bulan tersebut ada di `warga.json`
- Data bulan baru tidak akan ada di database sebelum bulan tersebut dimulai

### Download Excel Gagal
- Cek koneksi internet (untuk load library ExcelJS)
- Pastikan browser tidak memblock download
- Coba browser lain (Chrome/Firefox/Edge)

---

## 📞 Bantuan

Jika ada masalah atau pertanyaan:
1. Baca README.md untuk dokumentasi teknis
2. Cek file `warga.json` untuk melihat data mentah
3. Restart server jika ada error

---

**Selamat mengelola iuran komplek! 🏘️**

_Update: Juli 2026_
