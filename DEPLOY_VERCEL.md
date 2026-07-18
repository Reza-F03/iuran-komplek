# 🚀 Panduan Deploy ke Vercel via GitHub

## 📋 Persiapan

### 1. Pastikan File-file Sudah Siap

Cek file-file berikut sudah ada:
- ✅ `server.js` - Main application file
- ✅ `package.json` - Dependencies configuration
- ✅ `vercel.json` - Vercel configuration
- ✅ `.gitignore` - Ignore unnecessary files
- ✅ `README.md` - Documentation
- ✅ `views/index.ejs` - Main template
- ✅ `data/warga.json` - Data warga
- ✅ `data/pengeluaran.json` - Data pengeluaran
- ✅ `data/pemasukan_lain.json` - Data pemasukan lain

---

## 🔧 Langkah 1: Inisialisasi Git

Buka **Command Prompt** atau **PowerShell** di folder `d:\iuran_komplek`, lalu jalankan:

```bash
# Inisialisasi Git repository
git init

# Set branch utama ke 'main'
git branch -M main
```

---

## 📝 Langkah 2: Commit Files

```bash
# Tambahkan semua file ke staging
git add .

# Commit dengan message
git commit -m "Initial commit - Aplikasi Iuran Komplek Masihiro Residence"
```

---

## 🌐 Langkah 3: Buat Repository di GitHub

### A. Via Website GitHub:

1. **Buka browser**, pergi ke [https://github.com](https://github.com)
2. **Login** dengan akun GitHub Anda
3. Klik tombol **"+"** di pojok kanan atas
4. Pilih **"New repository"**
5. **Repository name:** `iuran-komplek-masihiro` (atau nama lain yang Anda suka)
6. **Description:** "Aplikasi Monitoring Pembayaran Iuran Komplek Masihiro Residence"
7. **Visibility:** 
   - **Private** (Recommended) - Hanya Anda yang bisa lihat
   - **Public** - Semua orang bisa lihat
8. **JANGAN centang** "Initialize this repository with:"
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
9. Klik **"Create repository"**

### B. Copy URL Repository

Setelah repository dibuat, Anda akan melihat URL seperti:
```
https://github.com/YOUR_USERNAME/iuran-komplek-masihiro.git
```

**Contoh:**
```
https://github.com/rezadev/iuran-komplek-masihiro.git
```

---

## 🔗 Langkah 4: Connect ke GitHub

Kembali ke Command Prompt/PowerShell, jalankan:

```bash
# Tambahkan remote origin (ganti YOUR_USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/YOUR_USERNAME/iuran-komplek-masihiro.git

# Push ke GitHub
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/rezadev/iuran-komplek-masihiro.git
git push -u origin main
```

**Jika diminta login:**
- Masukkan **username** GitHub Anda
- Masukkan **Personal Access Token** (bukan password!)
  - Cara buat token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

## ☁️ Langkah 5: Deploy ke Vercel

### A. Buka Vercel Website

1. **Buka browser**, pergi ke [https://vercel.com](https://vercel.com)
2. Klik **"Sign Up"** atau **"Login"**
3. Pilih **"Continue with GitHub"**
4. **Authorize Vercel** untuk mengakses akun GitHub Anda

### B. Import Project

1. Setelah login, klik **"Add New..."** di pojok kanan atas
2. Pilih **"Project"**
3. Anda akan lihat list repository GitHub Anda
4. Cari repository **`iuran-komplek-masihiro`**
5. Klik tombol **"Import"** di sebelah repository tersebut

### C. Configure Project

**Import Git Repository:**
- **Project Name:** `iuran-komplek-masihiro` (bisa diganti)
- **Framework Preset:** **Other** (biarkan default)
- **Root Directory:** `./` (biarkan default)
- **Build Command:** (kosongkan atau hapus)
- **Output Directory:** (kosongkan atau hapus)
- **Install Command:** `npm install` (default)

**Environment Variables:**
- Tidak perlu setting, skip saja (password admin sudah hardcoded di code)

### D. Deploy!

1. Klik tombol **"Deploy"**
2. Tunggu proses build & deploy (sekitar 1-3 menit)
3. Jika berhasil, akan muncul **"Congratulations!"** dengan 3 tombol:
   - **Visit** - Buka website
   - **View Project** - Lihat dashboard project
   - **Continue to Dashboard** - Ke dashboard Vercel

---

## 🎉 Langkah 6: Akses Website Anda

Setelah deploy berhasil, Anda akan dapat URL seperti:

```
https://iuran-komplek-masihiro.vercel.app
```

atau

```
https://iuran-komplek-masihiro-abcd1234.vercel.app
```

**Buka URL tersebut** di browser untuk mengakses aplikasi Anda!

---

## 🔄 Update Website (Push Changes)

Jika Anda ubah code dan ingin update website:

```bash
# Di folder d:\iuran_komplek

# 1. Tambahkan perubahan
git add .

# 2. Commit dengan pesan
git commit -m "Update: deskripsi perubahan"

# 3. Push ke GitHub
git push origin main
```

**Vercel akan otomatis deploy ulang** setiap kali Anda push ke GitHub! 🚀

---

## 🌍 Custom Domain (Optional)

Jika Anda punya domain sendiri (misalnya: `iuran.masihiro.com`):

1. **Di Vercel Dashboard:**
   - Buka project Anda
   - Tab **"Settings"**
   - Menu **"Domains"**
   - Klik **"Add"**
   - Masukkan domain Anda
   - Follow instruksi untuk setting DNS

2. **Di Domain Registrar (Namecheap, GoDaddy, dll):**
   - Tambahkan **CNAME record**:
     - Name: `iuran` (atau `@` untuk root domain)
     - Value: `cname.vercel-dns.com`

---

## ⚠️ Troubleshooting

### Error: "Build failed"

**Penyebab:** Dependency tidak terinstall atau ada error di code

**Solusi:**
1. Cek **build logs** di Vercel dashboard
2. Pastikan `package.json` sudah benar
3. Test di local: `npm install && npm start`
4. Push ulang setelah fix

### Error: "Module not found"

**Penyebab:** Dependency kurang di `package.json`

**Solusi:**
1. Cek apakah semua module di `package.json`
2. Di local, run: `npm install`
3. Commit & push `package.json` yang sudah update

### Error: "Port already in use"

**Penyebab:** Vercel tidak support custom port

**Solusi:**
Di `server.js`, ubah:
```javascript
// OLD
const PORT = 3000;
app.listen(PORT, ...);

// NEW
const PORT = process.env.PORT || 3000;
app.listen(PORT, ...);
```

### Website loading tapi data kosong

**Penyebab:** File JSON tidak ter-commit

**Solusi:**
```bash
git add data/warga.json
git add data/pengeluaran.json
git add data/pemasukan_lain.json
git commit -m "Add data files"
git push origin main
```

### Login admin tidak bisa

**Penyebab:** Session tidak persistent di serverless

**Solusi:**
- Vercel serverless function tidak support session yang persistent
- Untuk production, gunakan JWT token atau database-based session
- Untuk sementara, password check tetap bisa dipakai

---

## 📊 Monitoring Website

### Vercel Dashboard

**Analytics:**
- Lihat jumlah visitor
- Page views
- Performance metrics

**Deployment History:**
- Semua deployment tercatat
- Bisa rollback ke version sebelumnya
- Lihat logs setiap deployment

**Logs:**
- Real-time application logs
- Error tracking
- Function execution logs

---

## 💡 Tips & Best Practices

### 1. Gunakan Environment Variables untuk Sensitive Data

Di Vercel Dashboard → Settings → Environment Variables:
- Add `ADMIN_PASSWORD` = `masahiro123`

Di `server.js`:
```javascript
const PASSWORD_ADMIN = process.env.ADMIN_PASSWORD || 'masahiro123';
```

### 2. Enable Auto Deployment

Di GitHub repository settings:
- Settings → Webhooks
- Vercel webhook sudah otomatis tersetup
- Setiap push akan trigger auto-deploy

### 3. Use Branch Previews

- Push ke branch `dev` untuk testing
- Push ke branch `main` untuk production
- Vercel akan create preview URL untuk setiap branch

### 4. Monitor Performance

- Cek **Web Vitals** di Vercel dashboard
- Optimize images jika ada
- Monitor response time

---

## 🎓 Resources

- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **GitHub Docs:** [https://docs.github.com](https://docs.github.com)
- **Express on Vercel:** [https://vercel.com/guides/using-express-with-vercel](https://vercel.com/guides/using-express-with-vercel)
- **Git Tutorial:** [https://git-scm.com/docs](https://git-scm.com/docs)

---

## ✅ Checklist

Sebelum deploy, pastikan:

- [ ] `.gitignore` sudah dibuat (ignore `node_modules`, `.env`, dll)
- [ ] `vercel.json` sudah ada dan benar
- [ ] `package.json` punya script `"start": "node server.js"`
- [ ] Test di local dulu: `npm start`
- [ ] Data JSON files ada di folder `data/`
- [ ] Git repository sudah init
- [ ] Sudah commit semua files
- [ ] GitHub repository sudah dibuat
- [ ] Sudah push ke GitHub
- [ ] Vercel account sudah dibuat
- [ ] Project sudah di-import ke Vercel
- [ ] Deploy berhasil (status: ✅ Ready)
- [ ] Website bisa diakses via URL Vercel
- [ ] Login admin berfungsi
- [ ] Semua fitur berfungsi normal

---

## 🎊 Selamat!

Website Anda sekarang sudah **live** dan bisa diakses dari mana saja! 🌍

**URL Anda:**
```
https://iuran-komplek-masihiro.vercel.app
```

**Share ke warga komplek** agar mereka bisa akses dan monitor iuran mereka!

---

**© 2026 Reza - Komplek Masihiro Residence**
