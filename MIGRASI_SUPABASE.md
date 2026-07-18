# Panduan Migrasi ke Supabase

Aplikasi sekarang menggunakan **Supabase PostgreSQL** sebagai database, menggantikan file JSON lokal yang tidak bisa ditulis di Vercel.

---

## Langkah 1: Buat Project Supabase

1. Buka [https://supabase.com](https://supabase.com) dan login / daftar akun.
2. Klik **"New Project"**, isi nama project (contoh: `iuran-komplek`), pilih region terdekat (Singapore), dan set database password.
3. Tunggu project selesai dibuat (~1-2 menit).

---

## Langkah 2: Jalankan Schema SQL

1. Di dashboard Supabase, buka menu **SQL Editor** (ikon database di sidebar kiri).
2. Klik **"New query"**.
3. Copy seluruh isi file `supabase_schema.sql` dari project ini.
4. Paste ke editor, lalu klik **"Run"** (Ctrl+Enter).
5. Pastikan tidak ada error. Script ini akan:
   - Membuat 5 tabel: `warga`, `iuran_status`, `pengeluaran`, `pemasukan_lain`, `admin`
   - Membuat function `verify_admin_login` untuk verifikasi password
   - Memasukkan data 43 warga yang sudah ada
   - Mengisi status iuran semua bulan (bulan Jul = Lunas untuk hampir semua warga)
   - Membuat akun admin default (lihat bagian Akun Admin)

---

## Langkah 3: Ambil Credentials Supabase

Di dashboard Supabase, buka **Settings → API**:

- **Project URL** → ini adalah `SUPABASE_URL` (contoh: `https://abcxyz.supabase.co`)
- **service_role key** (bukan `anon` key) → ini adalah `SUPABASE_KEY`

> **Penting:** Gunakan `service_role` key, bukan `anon` key. Service role key memiliki akses penuh ke database dari sisi server dan diperlukan agar Row Level Security tidak memblokir operasi.

---

## Langkah 4: Set Environment Variables di Vercel

1. Buka [https://vercel.com](https://vercel.com) → pilih project Anda.
2. Masuk ke **Settings → Environment Variables**.
3. Tambahkan 3 variabel berikut (PASSWORD_ADMIN tidak perlu lagi, sudah di database):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | URL project Supabase Anda |
| `SUPABASE_KEY` | service_role key Supabase |
| `SESSION_SECRET` | string random panjang (contoh: `komplek-masihiro-secret-2026`) |

4. Pastikan environment diset ke **Production** (dan Preview jika perlu).

---

## Akun Admin Default

Setelah menjalankan `supabase_schema.sql`, akun admin sudah otomatis dibuat:

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `masahiro123` |

> Password di-hash menggunakan **bcrypt (cost factor 12)** via PostgreSQL `pgcrypto`. Tidak ada password plaintext yang tersimpan di database.

### Ganti Password Admin

Jalankan query ini di Supabase SQL Editor:

```sql
UPDATE admin 
SET password_hash = crypt('password_baru_anda', gen_salt('bf', 12)) 
WHERE username = 'admin';
```

### Tambah Akun Admin Baru

```sql
INSERT INTO admin (username, password_hash, nama_lengkap)
VALUES (
    'admin2',
    crypt('passwordnya', gen_salt('bf', 12)),
    'Nama Admin Kedua'
);
```

---

## Langkah 5: Install Dependencies & Deploy

Di terminal lokal:

```bash
npm install
```

Lalu push ke GitHub (Vercel akan auto-deploy):

```bash
git add .
git commit -m "Migrasi ke Supabase"
git push
```

Atau deploy manual via Vercel CLI:

```bash
vercel --prod
```

---

## Langkah 6: Verifikasi

Setelah deploy, test fitur-fitur berikut:

- [ ] Halaman utama tampil daftar warga
- [ ] Login admin berhasil
- [ ] Ubah status iuran (Lunas / Belum Bayar)
- [ ] Tambah warga baru
- [ ] Edit data warga
- [ ] Hapus warga
- [ ] Tambah pengeluaran
- [ ] Hapus pengeluaran
- [ ] Tambah pemasukan lain-lain
- [ ] Hapus pemasukan lain-lain
- [ ] Download Excel rekap iuran
- [ ] Download Excel laporan keuangan

---

## Struktur Database

```
warga
├── id (PK)
├── no_rumah
├── nama
├── nominal_iuran
└── created_at

iuran_status
├── id (PK)
├── warga_id (FK → warga.id, CASCADE DELETE)
├── bulan        ("Jan", "Feb", ..., "Des")
├── tahun        (2026)
└── status       ("Lunas" / "Belum Bayar")

pengeluaran
├── id (PK)
├── keterangan
├── nominal
├── bulan
├── tahun
└── tanggal

pemasukan_lain
├── id (PK)
├── keterangan
├── nominal
├── bulan
├── tahun
└── tanggal

admin
├── id (PK)
├── username     (UNIQUE)
├── password_hash  (bcrypt via pgcrypto)
├── nama_lengkap
├── created_at
└── last_login

Functions
└── verify_admin_login(username, password) → {id, username, nama_lengkap, valid}
```

---

## Troubleshooting

**Error 500 saat deploy:**
- Pastikan `SUPABASE_URL` dan `SUPABASE_KEY` sudah diset di Vercel Environment Variables.
- Pastikan menggunakan `service_role` key, bukan `anon` key.
- Cek Vercel Function Logs di dashboard untuk pesan error spesifik.

**Data tidak muncul setelah deploy:**
- Pastikan script SQL sudah dijalankan di Supabase SQL Editor.
- Cek tabel di Supabase **Table Editor** apakah data sudah ada.

**Status iuran tidak tersimpan:**
- Pastikan constraint `UNIQUE(warga_id, bulan, tahun)` ada di tabel `iuran_status`.
- Cek RLS policy di Supabase sudah mengizinkan operasi.

**Login admin gagal / error:**
- Pastikan function `verify_admin_login` sudah dibuat (ada di schema SQL).
- Cek di Supabase **Database → Functions** apakah function-nya ada.
- Cek tabel `admin` di **Table Editor** apakah data admin sudah ada.
- Pastikan extension `pgcrypto` aktif di **Database → Extensions**.
