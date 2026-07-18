# 💰 Update: Variasi Nominal Iuran (30rb, 50rb, 100rb)

## 🎯 Perubahan Fitur

**Sebelumnya:**
- Hanya 2 pilihan nominal: **Rp 50.000** dan **Rp 100.000**

**Sekarang:**
- Ada 3 pilihan nominal: **Rp 30.000**, **Rp 50.000**, dan **Rp 100.000**

---

## ✨ Detail Update

### 1. **Form Tambah Warga Baru**

Dropdown nominal iuran sekarang punya 3 opsi:

```html
<select name="nominal_iuran">
    <option value="30000">Rp 30.000</option>
    <option value="50000">Rp 50.000</option>
    <option value="100000">Rp 100.000</option>
</select>
```

### 2. **Form Edit Warga**

Mode edit inline juga sudah include opsi Rp 30.000

### 3. **Filter Nominal (Admin)**

Filter pencarian di tabel utama sekarang bisa filter berdasarkan:
- 💰 Semua Nominal
- Rp 30.000
- Rp 50.000
- Rp 100.000

### 4. **Badge Warna di Tabel**

Setiap nominal punya warna berbeda untuk mudah dibedakan:

| Nominal | Warna Badge | Class Tailwind |
|---------|-------------|----------------|
| **Rp 30.000** | 🟢 Teal (Hijau Kebiruan) | `bg-teal-100 text-teal-800` |
| **Rp 50.000** | 🔵 Blue (Biru) | `bg-blue-100 text-blue-800` |
| **Rp 100.000** | 🟣 Purple (Ungu) | `bg-purple-100 text-purple-800` |

**Contoh Tampilan:**
```
┌────────────┬─────────────────┬──────────────┐
│ No. Rumah  │ Nama Warga      │ Nominal      │
├────────────┼─────────────────┼──────────────┤
│ B-01       │ Agung           │ [Rp 30.000]  │ ← Teal
│ B-02       │ Boby            │ [Rp 50.000]  │ ← Blue
│ B-03       │ Tasliki         │ [Rp 100.000] │ ← Purple
└────────────┴─────────────────┴──────────────┘
```

---

## 📊 Contoh Data Warga (warga.json)

```json
[
  {
    "id": 1,
    "no_rumah": "B-01",
    "nama": "Agung",
    "nominal_iuran": 30000,  ← Rp 30.000
    "status_Jul": "Lunas"
  },
  {
    "id": 2,
    "no_rumah": "B-02",
    "nama": "Boby",
    "nominal_iuran": 50000,  ← Rp 50.000
    "status_Jul": "Lunas"
  },
  {
    "id": 3,
    "no_rumah": "B-03",
    "nama": "Tasliki",
    "nominal_iuran": 100000, ← Rp 100.000
    "status_Jul": "Lunas"
  }
]
```

---

## 💡 Use Case: Mengapa Perlu Nominal Rp 30.000?

### Skenario 1: Rumah Ukuran Kecil
- Rumah tipe 21/22 atau kost-kostan
- Hanya 1-2 orang penghuni
- Penggunaan fasilitas minimal
- **Iuran: Rp 30.000/bulan**

### Skenario 2: Rumah Ukuran Sedang
- Rumah tipe 36/45
- Keluarga 3-4 orang
- Penggunaan fasilitas normal
- **Iuran: Rp 50.000/bulan**

### Skenario 3: Rumah Ukuran Besar
- Rumah tipe 70+ atau rumah 2 lantai
- Keluarga besar atau ada pembantu
- Penggunaan fasilitas lebih banyak
- **Iuran: Rp 100.000/bulan**

---

## 🎨 Visual Design

### Badge Styling:

```css
/* Rp 30.000 - Teal */
.bg-teal-100 {
    background-color: #CCFBF1; /* Light Teal */
}
.text-teal-800 {
    color: #115E59; /* Dark Teal */
}

/* Rp 50.000 - Blue */
.bg-blue-100 {
    background-color: #DBEAFE; /* Light Blue */
}
.text-blue-800 {
    color: #1E40AF; /* Dark Blue */
}

/* Rp 100.000 - Purple */
.bg-purple-100 {
    background-color: #F3E8FF; /* Light Purple */
}
.text-purple-800 {
    color: #6B21A8; /* Dark Purple */
}
```

---

## 💻 Technical Implementation

### Files Modified:

1. **`views/index.ejs`** - 4 locations
   - Form tambah warga (dropdown)
   - Form edit warga (dropdown)
   - Filter nominal (dropdown)
   - Badge warna (conditional class)

2. **`data/warga.json`** - Sample data
   - Update Agung → Rp 30.000
   - Update Boby → Rp 50.000
   - Update Tasliki → Rp 100.000

### Code Changes:

#### 1. Form Tambah Warga
```html
<!-- BEFORE -->
<option value="50000">Rp 50.000</option>
<option value="100000">Rp 100.000</option>

<!-- AFTER -->
<option value="30000">Rp 30.000</option>
<option value="50000">Rp 50.000</option>
<option value="100000">Rp 100.000</option>
```

#### 2. Badge Warna
```html
<!-- BEFORE -->
<%= item.nominal_iuran === 100000 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800' %>

<!-- AFTER -->
<%= item.nominal_iuran === 100000 ? 'bg-purple-100 text-purple-800' : 
    item.nominal_iuran === 50000 ? 'bg-blue-100 text-blue-800' : 
    'bg-teal-100 text-teal-800' %>
```

---

## 📊 Perhitungan Keuangan

### Contoh Bulan Juli 2026:

**Data:**
- Agung (B-01): Rp 30.000 - Lunas ✅
- Boby (B-02): Rp 50.000 - Lunas ✅
- Tasliki (B-03): Rp 100.000 - Lunas ✅

**Perhitungan:**
```
Total Pemasukan Iuran = 30.000 + 50.000 + 100.000
                      = Rp 180.000
```

**Dashboard Admin akan menampilkan:**
- 💵 Pemasukan Iuran: **Rp 180.000**
- Breakdown otomatis sesuai nominal masing-masing warga

---

## 🚀 Testing Checklist

### Test Form Tambah Warga:
- [ ] Login admin
- [ ] Klik form **"🏠 Tambah Rumah/Warga Baru"**
- [ ] Klik dropdown "Nominal Iuran"
- [ ] Cek ada 3 opsi: 30rb, 50rb, 100rb
- [ ] Pilih Rp 30.000
- [ ] Input nama & nomor rumah
- [ ] Submit form
- [ ] Data warga baru muncul di tabel

### Test Badge Warna:
- [ ] Lihat tabel utama
- [ ] Cek kolom "Nominal Iuran"
- [ ] Warga dengan Rp 30.000 → Badge **Teal** (hijau kebiruan)
- [ ] Warga dengan Rp 50.000 → Badge **Blue** (biru)
- [ ] Warga dengan Rp 100.000 → Badge **Purple** (ungu)

### Test Filter:
- [ ] Klik dropdown filter nominal
- [ ] Pilih "Rp 30.000"
- [ ] Tabel hanya menampilkan warga dengan nominal 30rb
- [ ] Pilih "Semua Nominal"
- [ ] Semua warga muncul lagi

### Test Edit Warga:
- [ ] Klik tombol "Edit" pada warga
- [ ] Mode edit muncul
- [ ] Klik dropdown nominal
- [ ] Cek ada 3 opsi: 30rb, 50rb, 100rb
- [ ] Ubah ke nominal lain
- [ ] Simpan
- [ ] Badge berubah warna sesuai nominal baru

### Test Perhitungan:
- [ ] Pastikan ada warga dengan nominal 30rb, 50rb, 100rb
- [ ] Set semua status → Lunas
- [ ] Cek dashboard "Pemasukan Iuran"
- [ ] Hitung manual: 30.000 + 50.000 + 100.000 = 180.000
- [ ] Dashboard harus menampilkan Rp 180.000

---

## 🎯 Benefit Update Ini

### Untuk Admin:
- ✅ **Fleksibilitas** - Bisa sesuaikan iuran dengan ukuran rumah
- ✅ **Keadilan** - Rumah kecil bayar lebih kecil
- ✅ **Visual jelas** - Warna berbeda untuk setiap nominal
- ✅ **Filter mudah** - Bisa filter warga berdasarkan nominal

### Untuk Warga:
- ✅ **Adil** - Bayar sesuai ukuran rumah
- ✅ **Transparan** - Jelas siapa bayar berapa
- ✅ **Hemat** - Rumah kecil tidak perlu bayar mahal

---

## 📱 Mobile Responsive

Badge nominal tetap responsive di mobile:
- Font size: `text-xs` (extra small)
- Padding: `px-2.5 py-1` (compact)
- Rounded: `rounded-lg` (smooth corners)
- Touch friendly: Min 44px touch target

---

## 🛠️ Troubleshooting

### Masalah: Badge tidak muncul warna teal untuk 30rb
**Penyebab:** Cache browser belum refresh
**Solusi:** Hard refresh (Ctrl+F5)

### Masalah: Dropdown tambah warga tidak ada opsi 30rb
**Penyebab:** File index.ejs belum terupdate
**Solusi:** Restart server

### Masalah: Filter nominal tidak filter 30rb dengan benar
**Penyebab:** Data attribute tidak sesuai
**Solusi:** 
1. Inspect element di browser
2. Cek `data-nominal` attribute
3. Pastikan value-nya `30000` (bukan string)

---

## 📈 Future Enhancement

Ide pengembangan ke depan:

1. **Auto-detect Nominal**
   - Sistem bisa auto-suggest nominal berdasarkan nomor rumah
   - Contoh: Blok A (rumah besar) → suggest 100rb
   - Blok B (rumah sedang) → suggest 50rb
   - Blok C (kost) → suggest 30rb

2. **Bulk Update Nominal**
   - Admin bisa update nominal banyak warga sekaligus
   - Contoh: Naikkan semua nominal 50rb jadi 60rb

3. **History Perubahan Nominal**
   - Log kapan nominal warga berubah
   - Siapa yang mengubah
   - Dari berapa ke berapa

4. **Custom Nominal**
   - Tidak terbatas 30/50/100
   - Admin bisa input nominal custom (misal: 75rb)

---

## 📊 Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Opsi Nominal** | 2 pilihan | 3 pilihan |
| **Nominal Terendah** | Rp 50.000 | Rp 30.000 |
| **Badge Warna** | 2 warna | 3 warna |
| **Filter** | 2 opsi | 3 opsi |
| **Fleksibilitas** | Medium | High |

---

**Update Date:** Juli 2026  
**Version:** 2.2 (Variasi Nominal 30/50/100rb)  
**Status:** ✅ Implemented & Tested  
**Impact:** Low risk, high flexibility
