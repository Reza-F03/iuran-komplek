# 💰 Fitur Pemasukan Lain-lain (Di Luar Iuran Warga)

## 🎯 Deskripsi Fitur

Fitur ini memungkinkan **admin** untuk mencatat pemasukan yang berasal dari sumber **di luar iuran warga rutin**, seperti:
- 🏢 Sewa fasilitas komplek (ruang serbaguna, lapangan, dll)
- ⚠️ Denda keterlambatan pembayaran
- 🎁 Sumbangan atau donasi warga
- 💼 Hasil usaha komplek
- 📦 Penjualan barang/jasa komplek
- Dan pemasukan lainnya yang bukan iuran bulanan

Pemasukan ini akan **dihitung dalam total kas kumulatif** dan mempengaruhi laporan keuangan keseluruhan.

---

## ✨ Fitur Utama

### 1. **Dashboard Keuangan yang Diperluas**
Dashboard admin sekarang menampilkan **5 kartu** (sebelumnya 4):

| Kartu | Warna | Keterangan |
|-------|-------|------------|
| 💵 **Pemasukan Iuran** | Hijau Emerald | Iuran warga yang lunas |
| 💰 **Pemasukan Lain** | Teal/Cyan | Pemasukan di luar iuran (baru) |
| 💸 **Pengeluaran** | Merah | Total pengeluaran kas |
| 🏦 **Sisa Kas** | Biru | Pemasukan Total - Pengeluaran |
| 🎯 **Total Kumulatif** | Ungu | Kas akumulasi Jan - sekarang |

**Formula Perhitungan:**
```
Total Pemasukan = Pemasukan Iuran + Pemasukan Lain
Sisa Kas = Total Pemasukan - Pengeluaran
Total Kumulatif = Σ (Sisa Kas Jan - Bulan Berjalan)
```

### 2. **Form Tambah Pemasukan Lain**
Modal form untuk admin menambahkan pemasukan baru:

**Field:**
- 📝 **Keterangan**: Deskripsi pemasukan (contoh: "Sewa ruang serbaguna Pak Budi")
- 💵 **Nominal**: Jumlah uang dalam Rupiah
- 📅 **Bulan**: Pilih bulan pemasukan (Jan - Des)

**Tombol Akses:**
- Button **"➕ Tambah Pemasukan Lain"** (warna teal) di panel Kelola Keuangan

### 3. **Riwayat Pemasukan Lain**
Modal daftar semua pemasukan lain-lain dengan:

**Tampilan:**
- Badge bulan (cyan)
- Tanggal lengkap input
- Keterangan pemasukan
- Nominal dengan tanda `+ Rp` (hijau)
- Tombol **Hapus** (admin only)

**Tombol Akses:**
- Button **"📋 Riwayat Pemasukan Lain"** (warna cyan)

**Sorting:** Diurutkan dari tanggal terbaru ke terlama

### 4. **Laporan Keuangan Lengkap**
Modal Riwayat Keuangan sekarang include kolom pemasukan lain:

**Kolom Tabel:**
1. Bulan
2. **Pemasukan Iuran** (emerald)
3. **Pemasukan Lain** (teal) ← BARU
4. **Total Pemasukan** (hijau, background hijau)
5. Pengeluaran (merah)
6. Sisa Kas (biru/merah)
7. Total Kumulatif (indigo/merah)

**Info Box Keterangan:**
Menjelaskan bahwa "Pemasukan Lain" adalah pemasukan di luar iuran warga.

### 5. **Download Excel dengan 3 Sheet**
File Excel keuangan sekarang punya **3 sheet:**

**Sheet 1: Ringkasan Keuangan**
- Kolom: Bulan, Pemasukan Iuran, **Pemasukan Lain**, Total Pemasukan, Pengeluaran, Sisa Kas, Kumulatif
- Color coding: hijau (surplus), merah (defisit)

**Sheet 2: Detail Pengeluaran**
- Tanggal, Bulan, Keterangan, Nominal
- Header merah

**Sheet 3: Pemasukan Lain-lain** ← BARU
- Tanggal, Bulan, Keterangan, Nominal
- Header hijau

---

## 🗄️ Struktur Database

### File Baru: `data/pemasukan_lain.json`

**Format:**
```json
[
  {
    "id": 1,
    "keterangan": "Sewa ruang serbaguna Pak Budi",
    "nominal": 500000,
    "bulan": "Jul",
    "tanggal": "2026-07-17T10:30:00.000Z"
  },
  {
    "id": 2,
    "keterangan": "Denda keterlambatan bayar",
    "nominal": 50000,
    "bulan": "Jul",
    "tanggal": "2026-07-17T14:15:00.000Z"
  }
]
```

**Field:**
- `id`: Integer, auto increment
- `keterangan`: String, deskripsi pemasukan
- `nominal`: Integer, jumlah uang
- `bulan`: String, bulan pemasukan (Jan, Feb, ..., Des)
- `tanggal`: ISO 8601 timestamp

---

## 💻 Implementasi Teknis

### Backend (server.js)

#### 1. **Path Constants**
```javascript
const PEMASUKAN_LAIN_PATH = path.join(__dirname, 'data', 'pemasukan_lain.json');
```

#### 2. **CRUD Functions**
```javascript
// Baca data
function bacaPemasukanLain() {
    if (!fs.existsSync(PEMASUKAN_LAIN_PATH)) {
        fs.writeFileSync(PEMASUKAN_LAIN_PATH, JSON.stringify([], null, 2));
    }
    const rawData = fs.readFileSync(PEMASUKAN_LAIN_PATH);
    return JSON.parse(rawData);
}

// Simpan data
function simpanPemasukanLain(data) {
    fs.writeFileSync(PEMASUKAN_LAIN_PATH, JSON.stringify(data, null, 2));
}
```

#### 3. **Updated Calculation Function**
```javascript
function hitungKeuangan(warga, pengeluaran, pemasukanLain, bulan) {
    // Hitung pemasukan dari iuran
    let totalPemasukanIuran = 0;
    warga.forEach(item => {
        if (item['status_' + bulan] === 'Lunas') {
            totalPemasukanIuran += item.nominal_iuran || 0;
        }
    });
    
    // Hitung pemasukan lain-lain
    let totalPemasukanLain = 0;
    pemasukanLain.forEach(item => {
        if (item.bulan === bulan) {
            totalPemasukanLain += item.nominal || 0;
        }
    });
    
    // Total pemasukan = iuran + lain-lain
    const totalPemasukan = totalPemasukanIuran + totalPemasukanLain;
    
    // Hitung pengeluaran
    let totalPengeluaran = 0;
    pengeluaran.forEach(item => {
        if (item.bulan === bulan) {
            totalPengeluaran += item.nominal || 0;
        }
    });
    
    const sisaKas = totalPemasukan - totalPengeluaran;
    
    return {
        totalPemasukanIuran,
        totalPemasukanLain,
        totalPemasukan,
        totalPengeluaran,
        sisaKas
    };
}
```

#### 4. **New Routes**
```javascript
// Tambah pemasukan lain
app.post('/tambah-pemasukan-lain', proteksiAdmin, (req, res) => {
    const { keterangan, nominal, bulan } = req.body;
    const pemasukanLain = bacaPemasukanLain();
    
    const idBaru = pemasukanLain.length > 0 
        ? Math.max(...pemasukanLain.map(p => p.id)) + 1 
        : 1;
    
    pemasukanLain.push({
        id: idBaru,
        keterangan,
        nominal: parseInt(nominal) || 0,
        bulan: bulan || getBulanBerjalan(),
        tanggal: new Date().toISOString()
    });
    
    simpanPemasukanLain(pemasukanLain);
    res.redirect('/');
});

// Hapus pemasukan lain
app.post('/hapus-pemasukan-lain', proteksiAdmin, (req, res) => {
    const { id } = req.body;
    let pemasukanLain = bacaPemasukanLain();
    
    pemasukanLain = pemasukanLain.filter(item => item.id !== parseInt(id));
    simpanPemasukanLain(pemasukanLain);
    res.redirect('/');
});
```

### Frontend (index.ejs)

#### 1. **Dashboard Cards (5 Cards)**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
    <!-- Card 1: Pemasukan Iuran (emerald) -->
    <!-- Card 2: Pemasukan Lain (teal) -->
    <!-- Card 3: Pengeluaran (red) -->
    <!-- Card 4: Sisa Kas (blue) -->
    <!-- Card 5: Total Kumulatif (purple) -->
</div>
```

#### 2. **Tombol Kelola Keuangan (Updated)**
```html
<button onclick="bukaFormPemasukanLain()">➕ Tambah Pemasukan Lain</button>
<button onclick="bukaFormPengeluaran()">➕ Tambah Pengeluaran</button>
<button onclick="bukaListPemasukanLain()">📋 Riwayat Pemasukan Lain</button>
<button onclick="bukaListPengeluaran()">📋 Riwayat Pengeluaran</button>
<button onclick="bukaRiwayatKeuangan()">💰 Riwayat Keuangan</button>
```

#### 3. **JavaScript Functions**
```javascript
// Form pemasukan lain
function bukaFormPemasukanLain() {
    document.getElementById('modalPemasukanLain').classList.remove('hidden');
}

function tutupFormPemasukanLain() {
    document.getElementById('modalPemasukanLain').classList.add('hidden');
}

// List pemasukan lain
function bukaListPemasukanLain() {
    document.getElementById('modalListPemasukanLain').classList.remove('hidden');
}

function tutupListPemasukanLain() {
    document.getElementById('modalListPemasukanLain').classList.add('hidden');
}
```

---

## 🎨 Desain UI/UX

### Color Palette
- **Pemasukan Iuran**: `bg-gradient-to-br from-emerald-500 to-green-600`
- **Pemasukan Lain**: `bg-gradient-to-br from-teal-500 to-cyan-600`
- **Pengeluaran**: `bg-gradient-to-br from-red-500 to-rose-600`
- **Sisa Kas**: `bg-gradient-to-br from-blue-500 to-indigo-600`
- **Kumulatif**: `bg-gradient-to-br from-purple-600 to-pink-600`

### Modal Styling
- **Header Modal Form**: `from-teal-600 to-cyan-600`
- **Header Modal List**: `from-cyan-600 to-teal-600`
- **Badge Bulan**: `bg-cyan-100 text-cyan-700`
- **Nominal**: `text-green-600` dengan prefix `+`

---

## 📊 Contoh Skenario Penggunaan

### Skenario 1: Sewa Fasilitas
1. Pak Budi menyewa ruang serbaguna komplek Rp 500.000
2. Admin login → Klik **"➕ Tambah Pemasukan Lain"**
3. Input:
   - Keterangan: "Sewa ruang serbaguna Pak Budi"
   - Nominal: 500000
   - Bulan: Juli
4. Klik **"Simpan Pemasukan"**
5. Dashboard update:
   - Pemasukan Lain +500,000
   - Total Pemasukan +500,000
   - Sisa Kas +500,000
   - Kumulatif +500,000

### Skenario 2: Denda Keterlambatan
1. Bu Ani telat bayar iuran, kena denda Rp 50.000
2. Admin tambah pemasukan lain:
   - Keterangan: "Denda keterlambatan Bu Ani"
   - Nominal: 50000
   - Bulan: Juli
3. Kas bertambah Rp 50.000

### Skenario 3: Laporan Bulanan
**Bulan Juli 2026:**
- Pemasukan Iuran: Rp 1.500.000 (dari 10 warga @ Rp 150.000)
- Pemasukan Lain: Rp 550.000 (sewa + denda)
- **Total Pemasukan: Rp 2.050.000**
- Pengeluaran: Rp 1.200.000 (listrik, air, keamanan)
- **Sisa Kas: Rp 850.000**
- **Kumulatif (Jan-Jul): Rp 3.500.000**

---

## 🔒 Akses & Permission

| User | Tambah | Lihat List | Hapus | Lihat Dashboard | Download Excel |
|------|--------|------------|-------|----------------|----------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Warga** | ❌ | ❌ | ❌ | ❌ | ❌ |

**Catatan:** Warga bisa melihat hasil akhir di **Modal Riwayat Keuangan** (tabel ringkasan dengan kolom "Pemasukan Lain"), tapi tidak bisa lihat detail item per item.

---

## 📥 Download Excel Format

### Sheet 3: Pemasukan Lain-lain (NEW)

| Tanggal | Bulan | Keterangan | Nominal |
|---------|-------|------------|---------|
| 17 Jul 2026 10:30 | Jul | Sewa ruang serbaguna Pak Budi | Rp 500.000 |
| 17 Jul 2026 14:15 | Jul | Denda keterlambatan Bu Ani | Rp 50.000 |
| 15 Jun 2026 09:00 | Jun | Sumbangan Pak Hendra | Rp 200.000 |

**Style:**
- Header: Bold, white text, green background (`#10B981`)
- Nominal: Currency format `Rp #,##0`

---

## 🚀 Testing Checklist

### Test sebagai Admin:
- [ ] Login admin dengan password `masahiro123`
- [ ] Dashboard menampilkan 5 kartu (termasuk Pemasukan Lain)
- [ ] Klik **"➕ Tambah Pemasukan Lain"**
- [ ] Modal form terbuka dengan field lengkap
- [ ] Input data pemasukan baru:
  - Keterangan: "Test sewa fasilitas"
  - Nominal: 300000
  - Bulan: Juli
- [ ] Klik **"Simpan Pemasukan"**
- [ ] Redirect ke home, dashboard update
- [ ] Card "Pemasukan Lain" +300,000
- [ ] Card "Total Kumulatif" +300,000
- [ ] Klik **"📋 Riwayat Pemasukan Lain"**
- [ ] Modal list muncul dengan data baru
- [ ] Data diurutkan terbaru ke lama
- [ ] Klik **"🗑️ Hapus"** pada item test
- [ ] Konfirmasi hapus
- [ ] Data terhapus, dashboard update
- [ ] Klik **"💰 Riwayat Keuangan"**
- [ ] Tabel ada kolom "Pemasukan Lain"
- [ ] Total Pemasukan = Iuran + Lain
- [ ] Download Excel
- [ ] File punya 3 sheet (termasuk sheet Pemasukan Lain-lain)

### Test Integrasi:
- [ ] Tambah pemasukan lain Rp 500.000
- [ ] Tambah pengeluaran Rp 300.000
- [ ] Sisa Kas = (Iuran + 500.000) - 300.000
- [ ] Total Kumulatif update sesuai rumus
- [ ] Excel sheet 1 menampilkan breakdown lengkap

---

## 🛠️ Troubleshooting

### Masalah: Dashboard tidak update setelah tambah pemasukan
**Penyebab:** Cache browser
**Solusi:** Hard refresh (Ctrl+F5 atau Ctrl+Shift+R)

### Masalah: Total Kumulatif salah
**Penyebab:** Fungsi `hitungKumulatifKas()` tidak include `pemasukanLain`
**Solusi:** Pastikan semua call ke `hitungKeuangan()` dan `hitungKumulatifKas()` pass parameter `pemasukanLain`

### Masalah: Modal tidak muncul
**Penyebab:** JavaScript error atau ID modal salah
**Solusi:** 
1. Buka browser console (F12)
2. Cek error JavaScript
3. Pastikan ID modal: `modalPemasukanLain`, `modalListPemasukanLain`

### Masalah: File `pemasukan_lain.json` tidak ada
**Penyebab:** Belum pernah tambah pemasukan lain
**Solusi:** File akan otomatis dibuat saat pertama kali tambah data

---

## 📈 Roadmap Future Enhancement

Ide pengembangan fitur pemasukan lain ke depan:

1. **Kategori Pemasukan Lain**
   - Dropdown kategori: Sewa, Denda, Sumbangan, Lainnya
   - Filter berdasarkan kategori
   - Chart breakdown per kategori

2. **Upload Bukti Pemasukan**
   - Upload foto/scan kwitansi
   - Penyimpanan di `data/uploads/pemasukan/`
   - View bukti di modal detail

3. **Recurring Pemasukan**
   - Set pemasukan yang berulang tiap bulan
   - Contoh: Sewa parkir mobil tetap
   - Auto-generate tiap bulan

4. **Export PDF**
   - Laporan pemasukan lain dalam format PDF
   - Terpisah dari Excel
   - Template profesional

5. **Notifikasi Warga**
   - Notifikasi ke warga saat ada pemasukan lain
   - Transparansi real-time
   - Via email atau WhatsApp

---

## 📞 Support

Jika ada pertanyaan atau masalah terkait fitur pemasukan lain-lain:

**Admin:** Hubungi developer sistem
**Warga:** Hubungi admin komplek untuk info pemasukan lain-lain

---

**Dokumentasi dibuat:** Juli 2026  
**Versi Sistem:** 2.0 (dengan fitur Pemasukan Lain-lain)  
**Developer:** iuran_komplek team
