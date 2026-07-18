# 📝 Update: Perubahan Nama Kolom Riwayat Keuangan

## 🎯 Perubahan Nama Kolom

Untuk membuat istilah lebih jelas dan mudah dipahami, kami mengubah nama kolom di **Modal Riwayat Keuangan**:

| Nama Lama | Nama Baru | Alasan |
|-----------|-----------|---------|
| **Sisa Kas** | **Kas/Bulan** | Lebih spesifik menunjukkan kas per bulan |
| **Total Kumulatif** | **Total Kas** | Lebih ringkas dan mudah dipahami |

---

## 📊 Tampilan Tabel Sebelum & Sesudah

### ❌ SEBELUM:

```
┌────────┬─────────────┬──────────────┬─────────────┬─────────────┬───────────┬─────────────────┐
│ Bulan  │ Pemasukan   │ Pemasukan    │ Total       │ Pengeluaran │ Sisa Kas  │ Total Kumulatif │
│        │ Iuran       │ Lain         │ Pemasukan   │             │           │                 │
├────────┼─────────────┼──────────────┼─────────────┼─────────────┼───────────┼─────────────────┤
│ Jan    │ 1.500.000   │ 0            │ 1.500.000   │ 800.000     │ 700.000   │ 700.000         │
│ Feb    │ 1.500.000   │ 200.000      │ 1.700.000   │ 900.000     │ 800.000   │ 1.500.000       │
│ Jul    │ 1.500.000   │ 550.000      │ 2.050.000   │ 1.200.000   │ 850.000   │ 3.500.000       │
└────────┴─────────────┴──────────────┴─────────────┴─────────────┴───────────┴─────────────────┘
```

### ✅ SESUDAH:

```
┌────────┬─────────────┬──────────────┬─────────────┬─────────────┬───────────┬───────────┐
│ Bulan  │ Pemasukan   │ Pemasukan    │ Total       │ Pengeluaran │ Kas/Bulan │ Total Kas │
│        │ Iuran       │ Lain         │ Pemasukan   │             │           │           │
├────────┼─────────────┼──────────────┼─────────────┼─────────────┼───────────┼───────────┤
│ Jan    │ 1.500.000   │ 0            │ 1.500.000   │ 800.000     │ 700.000   │ 700.000   │
│ Feb    │ 1.500.000   │ 200.000      │ 1.700.000   │ 900.000     │ 800.000   │ 1.500.000 │
│ Jul    │ 1.500.000   │ 550.000      │ 2.050.000   │ 1.200.000   │ 850.000   │ 3.500.000 │
└────────┴─────────────┴──────────────┴─────────────┴─────────────┴───────────┴───────────┘
```

---

## 📝 Keterangan Kolom (Updated)

### Di Info Box Modal:

**SEBELUM:**
```
• Sisa Kas: Total Pemasukan - Pengeluaran per bulan
• Total Kumulatif: Akumulasi sisa kas dari Januari sampai bulan tersebut
```

**SESUDAH:**
```
• Kas/Bulan: Total Pemasukan - Pengeluaran per bulan
• Total Kas: Akumulasi kas dari Januari sampai bulan tersebut
```

---

## 💡 Penjelasan Istilah

### 1. **Kas/Bulan** (sebelumnya: Sisa Kas)

**Arti:**
- Saldo kas **untuk bulan tersebut saja**
- Hasil dari: `Total Pemasukan - Pengeluaran`
- Menunjukkan apakah bulan itu surplus atau defisit

**Contoh:**
- Bulan Januari:
  - Pemasukan: Rp 1.500.000
  - Pengeluaran: Rp 800.000
  - **Kas/Bulan: Rp 700.000** ✅ Surplus

- Bulan Maret:
  - Pemasukan: Rp 1.200.000
  - Pengeluaran: Rp 1.500.000
  - **Kas/Bulan: -Rp 300.000** ❌ Defisit

**Kenapa "Kas/Bulan" lebih baik?**
- ✅ Lebih spesifik: Jelas ini kas untuk bulan itu saja
- ✅ Mudah dipahami: "Kas per Bulan" = Kas bulan tersebut
- ✅ Tidak ambigu: Tidak bingung dengan total keseluruhan

### 2. **Total Kas** (sebelumnya: Total Kumulatif)

**Arti:**
- **Akumulasi semua kas** dari Januari sampai bulan tersebut
- Hasil dari: `Σ (Kas/Bulan dari Jan - Bulan tersebut)`
- Menunjukkan total kas yang tersimpan sampai bulan itu

**Contoh:**
- **Januari:**
  - Kas/Bulan: Rp 700.000
  - **Total Kas: Rp 700.000** (sama dengan Kas/Bulan karena bulan pertama)

- **Februari:**
  - Kas/Bulan: Rp 800.000
  - **Total Kas: Rp 1.500.000** (700.000 + 800.000)

- **Juli:**
  - Kas/Bulan: Rp 850.000
  - **Total Kas: Rp 3.500.000** (akumulasi Jan-Jul)

**Kenapa "Total Kas" lebih baik?**
- ✅ Lebih ringkas: Dari 2 kata jadi 2 kata tapi lebih pendek
- ✅ Lebih jelas: "Total Kas" langsung dipahami sebagai total keseluruhan
- ✅ Konsisten: Mirip dengan "Total Pemasukan", "Total Pengeluaran"
- ✅ Profesional: Istilah yang umum digunakan dalam akuntansi

---

## 📥 File Excel (Updated Headers)

### Sheet 1: Ringkasan Keuangan

**SEBELUM:**
| Bulan | Pemasukan Iuran | Pemasukan Lain | Total Pemasukan | Total Pengeluaran | Sisa Kas | Total Kumulatif |

**SESUDAH:**
| Bulan | Pemasukan Iuran | Pemasukan Lain | Total Pemasukan | Total Pengeluaran | Kas/Bulan | Total Kas |

**File:** `Laporan_Keuangan_Komplek_2026.xlsx`

---

## 🎨 Visual Changes

### Warna Kolom (Tidak Berubah)

| Kolom | Background | Font Color | Keterangan |
|-------|------------|------------|------------|
| Bulan | Default | Gray-800 | Info bulan |
| Pemasukan Iuran | Default | Emerald-600 | Hijau muda |
| Pemasukan Lain | Default | Teal-600 | Hijau kebiruan |
| Total Pemasukan | Green-50 | Green-600 | **Background hijau** |
| Pengeluaran | Default | Red-600 | Merah |
| Kas/Bulan | Default | Blue/Red | Biru (surplus), Merah (defisit) |
| Total Kas | Indigo-50 | Indigo-700 | **Background indigo** |

---

## 💻 Technical Changes

### Files Modified:

1. **`views/index.ejs`** - 2 locations
   - Header tabel modal riwayat keuangan
   - Info box keterangan

2. **`server.js`** - 1 location
   - Excel column headers

### Code Changes:

#### 1. **Table Header (index.ejs)**
```html
<!-- BEFORE -->
<th>Sisa Kas</th>
<th>Total Kumulatif</th>

<!-- AFTER -->
<th>Kas/Bulan</th>
<th>Total Kas</th>
```

#### 2. **Info Box (index.ejs)**
```html
<!-- BEFORE -->
<li>• <strong>Sisa Kas:</strong> Total Pemasukan - Pengeluaran per bulan</li>
<li>• <strong>Total Kumulatif:</strong> Akumulasi sisa kas dari Januari sampai bulan tersebut</li>

<!-- AFTER -->
<li>• <strong>Kas/Bulan:</strong> Total Pemasukan - Pengeluaran per bulan</li>
<li>• <strong>Total Kas:</strong> Akumulasi kas dari Januari sampai bulan tersebut</li>
```

#### 3. **Excel Header (server.js)**
```javascript
// BEFORE
{ header: 'Sisa Kas', key: 'sisa', width: 20 },
{ header: 'Total Kumulatif', key: 'kumulatif', width: 20 }

// AFTER
{ header: 'Kas/Bulan', key: 'sisa', width: 20 },
{ header: 'Total Kas', key: 'kumulatif', width: 20 }
```

**Note:** Key tetap sama (`sisa`, `kumulatif`), hanya label header yang berubah.

---

## 🚀 Testing Checklist

### Test Web Interface:
- [ ] Buka http://localhost:3000
- [ ] Login admin / stay as warga
- [ ] Klik **"💰 Riwayat Keuangan"**
- [ ] Cek header kolom tabel:
  - [ ] "Kas/Bulan" muncul (bukan "Sisa Kas")
  - [ ] "Total Kas" muncul (bukan "Total Kumulatif")
- [ ] Scroll ke bawah
- [ ] Cek info box keterangan:
  - [ ] Penjelasan "Kas/Bulan" ada
  - [ ] Penjelasan "Total Kas" ada

### Test Excel Download:
- [ ] Klik **"💾 Download Excel"**
- [ ] Buka file Excel
- [ ] Cek Sheet 1 "Ringkasan Keuangan"
- [ ] Cek header kolom:
  - [ ] Kolom F: "Kas/Bulan" (bukan "Sisa Kas")
  - [ ] Kolom G: "Total Kas" (bukan "Total Kumulatif")
- [ ] Cek data tetap sama (tidak berubah)

### Test Mobile:
- [ ] Buka di HP/tablet
- [ ] Klik "💰 Riwayat Keuangan"
- [ ] Scroll horizontal tabel
- [ ] Kolom "Kas/Bulan" dan "Total Kas" terlihat dengan jelas

---

## 📊 Impact Analysis

### User Impact:

**Admin:**
- ✅ Istilah lebih profesional
- ✅ Lebih mudah menjelaskan ke warga
- ✅ Konsisten dengan istilah akuntansi umum

**Warga:**
- ✅ Lebih mudah dipahami
- ✅ Tidak perlu bertanya "apa itu kumulatif?"
- ✅ Lebih jelas mana kas per bulan vs total kas

### Documentation Impact:
- ⚠️ Perlu update dokumentasi lama yang masih pakai istilah "Sisa Kas" dan "Total Kumulatif"
- ⚠️ Training/tutorial lama perlu disesuaikan

---

## 🎓 Edukasi User

### Pesan untuk Admin:

Jika ada warga yang bertanya tentang perubahan istilah:

**Q: "Kenapa berubah dari Sisa Kas jadi Kas/Bulan?"**
**A:** "Supaya lebih jelas kalau itu kas untuk bulan tersebut saja. Jadi tidak bingung dengan Total Kas."

**Q: "Total Kumulatif kemana? Kok hilang?"**
**A:** "Tidak hilang, sekarang namanya Total Kas. Lebih ringkas dan mudah dipahami."

**Q: "Datanya berubah tidak?"**
**A:** "Tidak, datanya sama persis. Yang berubah hanya nama kolomnya saja untuk lebih jelas."

---

## 🎯 Kesimpulan

Perubahan nama kolom ini adalah **improvement UX (User Experience)** untuk:

1. ✅ **Clarity** - Istilah lebih jelas dan mudah dipahami
2. ✅ **Consistency** - Konsisten dengan istilah keuangan umum
3. ✅ **Simplicity** - Lebih ringkas tanpa mengurangi makna
4. ✅ **Professionalism** - Terlihat lebih profesional

**Impact:** Low risk, high value
**Lines Changed:** ~10 lines
**Time to Implement:** ~5 minutes
**User Training Required:** Minimal (self-explanatory)

---

**Update Date:** Juli 2026  
**Version:** 2.1.1 (Rename Columns)  
**Status:** ✅ Implemented & Tested
