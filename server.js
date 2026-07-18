const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const session = require('express-session');

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'data', 'warga.json');
const PENGELUARAN_PATH = path.join(__dirname, 'data', 'pengeluaran.json');
const PEMASUKAN_LAIN_PATH = path.join(__dirname, 'data', 'pemasukan_lain.json');
const PASSWORD_ADMIN = 'masahiro123'; // Silakan ganti password Admin Anda di sini

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Setup Session Middleware
app.use(session({
    secret: 'kunci-rahasia-komplek',
    resave: false,
    saveUninitialized: true
}));

// FUNGSI DINAMIS: Mengambil nama bulan berjalan saja
function getBulanBerjalan() {
    const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const sekarang = new Date();
    const bulanSekarang = namaBulan[sekarang.getMonth()];
    return bulanSekarang; // Mengembalikan string, misal: 'Jul'
}

// FUNGSI: Mengambil daftar bulan dari Januari sampai Desember secara berurutan
function getAllBulanFromData(warga) {
    // Daftar bulan lengkap dari Januari sampai Desember
    const daftarBulanLengkap = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return daftarBulanLengkap;
}

// Fungsi pembantu database JSON
function bacaData() {
    const rawData = fs.readFileSync(DATA_PATH);
    const warga = JSON.parse(rawData);
    const bulanSekarang = getBulanBerjalan();

    // Pastikan field bulan berjalan sudah ada di setiap data warga, jika belum ada set 'Belum Bayar'
    return warga.map(item => {
        if (!item[`status_${bulanSekarang}`]) item[`status_${bulanSekarang}`] = 'Belum Bayar';
        return item;
    });
}

function simpanData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Fungsi untuk pengeluaran
function bacaPengeluaran() {
    if (!fs.existsSync(PENGELUARAN_PATH)) {
        fs.writeFileSync(PENGELUARAN_PATH, JSON.stringify([], null, 2));
    }
    const rawData = fs.readFileSync(PENGELUARAN_PATH);
    return JSON.parse(rawData);
}

function simpanPengeluaran(data) {
    fs.writeFileSync(PENGELUARAN_PATH, JSON.stringify(data, null, 2));
}

// Fungsi untuk pemasukan lain-lain
function bacaPemasukanLain() {
    if (!fs.existsSync(PEMASUKAN_LAIN_PATH)) {
        fs.writeFileSync(PEMASUKAN_LAIN_PATH, JSON.stringify([], null, 2));
    }
    const rawData = fs.readFileSync(PEMASUKAN_LAIN_PATH);
    return JSON.parse(rawData);
}

function simpanPemasukanLain(data) {
    fs.writeFileSync(PEMASUKAN_LAIN_PATH, JSON.stringify(data, null, 2));
}

// Fungsi hitung total kas
function hitungKeuangan(warga, pengeluaran, pemasukanLain, bulan) {
    // Hitung pemasukan dari iuran warga
    let totalPemasukanIuran = 0;
    warga.forEach(item => {
        if (item['status_' + bulan] === 'Lunas') {
            totalPemasukanIuran += item.nominal_iuran || 0;
        }
    });
    
    // Hitung pemasukan lain-lain bulan tersebut
    let totalPemasukanLain = 0;
    pemasukanLain.forEach(item => {
        if (item.bulan === bulan) {
            totalPemasukanLain += item.nominal || 0;
        }
    });
    
    // Total pemasukan = iuran + pemasukan lain
    const totalPemasukan = totalPemasukanIuran + totalPemasukanLain;
    
    // Hitung total pengeluaran bulan tersebut
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

// Fungsi hitung kumulatif kas dari Januari sampai bulan tertentu
function hitungKumulatifKas(warga, pengeluaran, pemasukanLain, sampaBulan) {
    const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const indexSampai = namaBulan.indexOf(sampaBulan);
    
    let totalKumulatif = 0;
    
    // Loop dari Januari sampai bulan yang ditentukan
    for (let i = 0; i <= indexSampai; i++) {
        const bulan = namaBulan[i];
        const keuangan = hitungKeuangan(warga, pengeluaran, pemasukanLain, bulan);
        totalKumulatif += keuangan.sisaKas;
    }
    
    return totalKumulatif;
}

// Middleware untuk memproteksi rute khusus Admin
function proteksiAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(403).send('Akses Ditolak: Anda harus login sebagai Admin.');
    }
}

// Halaman Utama: Warga & Admin melihat tabel yang sama, tapi menu aksinya berbeda
app.get('/', (req, res) => {
    const warga = bacaData();
    const bulanBerjalan = getBulanBerjalan(); // Ambil bulan berjalan saja
    const semuaBulan = getAllBulanFromData(warga); // Ambil semua bulan historis
    const pengeluaran = bacaPengeluaran();
    const pemasukanLain = bacaPemasukanLain();
    const keuangan = hitungKeuangan(warga, pengeluaran, pemasukanLain, bulanBerjalan);
    const totalKumulatif = hitungKumulatifKas(warga, pengeluaran, pemasukanLain, bulanBerjalan);
    
    // Hitung keuangan untuk semua bulan (untuk modal riwayat)
    const riwayatKeuangan = semuaBulan.map(bulan => {
        const keuanganBulan = hitungKeuangan(warga, pengeluaran, pemasukanLain, bulan);
        const kumulatifBulan = hitungKumulatifKas(warga, pengeluaran, pemasukanLain, bulan);
        return {
            bulan: bulan,
            pemasukanIuran: keuanganBulan.totalPemasukanIuran,
            pemasukanLain: keuanganBulan.totalPemasukanLain,
            pemasukan: keuanganBulan.totalPemasukan,
            pengeluaran: keuanganBulan.totalPengeluaran,
            sisaKas: keuanganBulan.sisaKas,
            kumulatif: kumulatifBulan
        };
    });
    
    res.render('index', { 
        warga, 
        isAdmin: req.session.isAdmin || false,
        bulanBerjalan,
        semuaBulan,
        pengeluaran,
        pemasukanLain,
        keuangan,
        totalKumulatif,
        riwayatKeuangan
    });
});

// Proses Login Admin
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === PASSWORD_ADMIN) {
        req.session.isAdmin = true;
    }
    res.redirect('/');
});

// Proses Logout Admin
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// ================= HANYA BISA DIAKSES ADMIN =================

// 1. Tambah Rumah Baru
app.post('/tambah-warga', proteksiAdmin, (req, res) => {
    const { no_rumah, nama, nominal_iuran } = req.body;
    const warga = bacaData();
    const bulanSekarang = getBulanBerjalan();
    
    const idBaru = warga.length > 0 ? Math.max(...warga.map(w => w.id)) + 1 : 1;
    
    // Rumah baru hanya punya status untuk bulan berjalan
    const rumahBaru = {
        id: idBaru,
        no_rumah,
        nama,
        nominal_iuran: parseInt(nominal_iuran) || 50000
    };
    rumahBaru[`status_${bulanSekarang}`] = 'Belum Bayar';
    
    warga.push(rumahBaru);

    simpanData(warga);
    res.redirect('/');
});

// 2. Ubah Status Iuran (Lunas / Belum Bayar)
app.post('/update-iuran', proteksiAdmin, (req, res) => {
    const { id, bulan, status } = req.body;
    let warga = bacaData();
    
    warga = warga.map(item => {
        if (item.id === parseInt(id)) {
            item[`status_${bulan}`] = status;
        }
        return item;
    });

    simpanData(warga);
    res.redirect('/');
});

// 3. Hapus Data Rumah
app.post('/hapus-warga', proteksiAdmin, (req, res) => {
    const { id } = req.body;
    let warga = bacaData();
    
    warga = warga.filter(item => item.id !== parseInt(id));
    simpanData(warga);
    res.redirect('/');
});


// 4. Edit Data Rumah (Nomor Rumah & Nama Pemilik)
app.post('/edit-warga', proteksiAdmin, (req, res) => {
    const { id, no_rumah, nama, nominal_iuran } = req.body;
    let warga = bacaData();
    
    warga = warga.map(item => {
        if (item.id === parseInt(id)) {
            item.no_rumah = no_rumah;
            item.nama = nama;
            item.nominal_iuran = parseInt(nominal_iuran) || item.nominal_iuran || 50000;
        }
        return item;
    });

    simpanData(warga);
    res.redirect('/');
});

// ==============================================================

// 5. Tambah Pengeluaran
app.post('/tambah-pengeluaran', proteksiAdmin, (req, res) => {
    const { keterangan, nominal, bulan } = req.body;
    const pengeluaran = bacaPengeluaran();
    
    const idBaru = pengeluaran.length > 0 ? Math.max(...pengeluaran.map(p => p.id)) + 1 : 1;
    const tanggal = new Date().toISOString();
    
    pengeluaran.push({
        id: idBaru,
        keterangan,
        nominal: parseInt(nominal) || 0,
        bulan: bulan || getBulanBerjalan(),
        tanggal
    });
    
    simpanPengeluaran(pengeluaran);
    res.redirect('/');
});

// 6. Hapus Pengeluaran
app.post('/hapus-pengeluaran', proteksiAdmin, (req, res) => {
    const { id } = req.body;
    let pengeluaran = bacaPengeluaran();
    
    pengeluaran = pengeluaran.filter(item => item.id !== parseInt(id));
    simpanPengeluaran(pengeluaran);
    res.redirect('/');
});

// 7. Tambah Pemasukan Lain-lain
app.post('/tambah-pemasukan-lain', proteksiAdmin, (req, res) => {
    const { keterangan, nominal, bulan } = req.body;
    const pemasukanLain = bacaPemasukanLain();
    
    const idBaru = pemasukanLain.length > 0 ? Math.max(...pemasukanLain.map(p => p.id)) + 1 : 1;
    const tanggal = new Date().toISOString();
    
    pemasukanLain.push({
        id: idBaru,
        keterangan,
        nominal: parseInt(nominal) || 0,
        bulan: bulan || getBulanBerjalan(),
        tanggal
    });
    
    simpanPemasukanLain(pemasukanLain);
    res.redirect('/');
});

// 8. Hapus Pemasukan Lain-lain
app.post('/hapus-pemasukan-lain', proteksiAdmin, (req, res) => {
    const { id } = req.body;
    let pemasukanLain = bacaPemasukanLain();
    
    pemasukanLain = pemasukanLain.filter(item => item.id !== parseInt(id));
    simpanPemasukanLain(pemasukanLain);
    res.redirect('/');
});

// ==============================================================

// Download Excel (Bisa diakses Warga & Admin)
app.get('/download-excel', async (req, res) => {
    const warga = bacaData();
    const semuaBulan = getAllBulanFromData(warga); // Ambil semua bulan yang ada di database
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Iuran');

    // Buat kolom dinamis berdasarkan semua bulan yang ada
    const columns = [
        { header: 'No. Rumah', key: 'no_rumah', width: 15 },
        { header: 'Nama Pemilik', key: 'nama', width: 25 }
    ];
    
    semuaBulan.forEach(bulan => {
        columns.push({ header: `Status ${bulan}`, key: `status_${bulan}`, width: 18 });
    });
    
    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F46E5' } };

    warga.forEach(item => {
        const row = worksheet.addRow(item);
        semuaBulan.forEach(bulan => {
            const key = `status_${bulan}`;
            const cell = row.getCell(key);
            if (cell.value === 'Lunas') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
                cell.font = { color: { argb: '15803D' } };
            } else if (cell.value === 'Belum Bayar') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
                cell.font = { color: { argb: 'B91C1C' } };
            }
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Iuran_Komplek_Lengkap.xlsx');
    await workbook.xlsx.write(res);
    res.end();
});

// Download Excel untuk bulan tertentu (Khusus Admin)
app.get('/download-excel-bulan/:bulan', proteksiAdmin, async (req, res) => {
    const { bulan } = req.params;
    const warga = bacaData();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Laporan ${bulan}`);

    worksheet.columns = [
        { header: 'No. Rumah', key: 'no_rumah', width: 15 },
        { header: 'Nama Pemilik', key: 'nama', width: 25 },
        { header: `Status ${bulan}`, key: `status_${bulan}`, width: 18 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F46E5' } };

    warga.forEach(item => {
        const row = worksheet.addRow(item);
        const key = `status_${bulan}`;
        const cell = row.getCell(key);
        if (cell.value === 'Lunas') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
            cell.font = { color: { argb: '15803D' } };
        } else if (cell.value === 'Belum Bayar') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
            cell.font = { color: { argb: 'B91C1C' } };
        }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Laporan_Iuran_${bulan}_2026.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
});

// Download Excel Laporan Keuangan (Bisa diakses Warga & Admin)
app.get('/download-keuangan', async (req, res) => {
    const warga = bacaData();
    const pengeluaran = bacaPengeluaran();
    const pemasukanLain = bacaPemasukanLain();
    const semuaBulan = getAllBulanFromData(warga);
    
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Ringkasan Keuangan
    const sheetRingkasan = workbook.addWorksheet('Ringkasan Keuangan');
    sheetRingkasan.columns = [
        { header: 'Bulan', key: 'bulan', width: 15 },
        { header: 'Pemasukan Iuran', key: 'pemasukanIuran', width: 20 },
        { header: 'Pemasukan Lain', key: 'pemasukanLain', width: 20 },
        { header: 'Total Pemasukan', key: 'pemasukan', width: 20 },
        { header: 'Total Pengeluaran', key: 'pengeluaran', width: 20 },
        { header: 'Kas/Bulan', key: 'sisa', width: 20 },
        { header: 'Total Kas', key: 'kumulatif', width: 20 }
    ];
    
    sheetRingkasan.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheetRingkasan.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F46E5' } };
    
    semuaBulan.forEach(bulan => {
        const keuangan = hitungKeuangan(warga, pengeluaran, pemasukanLain, bulan);
        const kumulatif = hitungKumulatifKas(warga, pengeluaran, pemasukanLain, bulan);
        const row = sheetRingkasan.addRow({
            bulan: bulan,
            pemasukanIuran: keuangan.totalPemasukanIuran,
            pemasukanLain: keuangan.totalPemasukanLain,
            pemasukan: keuangan.totalPemasukan,
            pengeluaran: keuangan.totalPengeluaran,
            sisa: keuangan.sisaKas,
            kumulatif: kumulatif
        });
        
        // Format currency
        row.getCell('pemasukanIuran').numFmt = 'Rp #,##0';
        row.getCell('pemasukanLain').numFmt = 'Rp #,##0';
        row.getCell('pemasukan').numFmt = 'Rp #,##0';
        row.getCell('pengeluaran').numFmt = 'Rp #,##0';
        row.getCell('sisa').numFmt = 'Rp #,##0';
        row.getCell('kumulatif').numFmt = 'Rp #,##0';
        
        // Color coding untuk sisa kas
        if (keuangan.sisaKas < 0) {
            row.getCell('sisa').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
            row.getCell('sisa').font = { color: { argb: 'B91C1C' } };
        } else {
            row.getCell('sisa').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
            row.getCell('sisa').font = { color: { argb: '15803D' } };
        }
        
        // Color coding untuk kumulatif
        if (kumulatif < 0) {
            row.getCell('kumulatif').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
            row.getCell('kumulatif').font = { bold: true, color: { argb: 'B91C1C' } };
        } else {
            row.getCell('kumulatif').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E7FF' } };
            row.getCell('kumulatif').font = { bold: true, color: { argb: '4F46E5' } };
        }
    });
    
    // Sheet 2: Detail Pengeluaran
    const sheetPengeluaran = workbook.addWorksheet('Detail Pengeluaran');
    sheetPengeluaran.columns = [
        { header: 'Tanggal', key: 'tanggal', width: 20 },
        { header: 'Bulan', key: 'bulan', width: 12 },
        { header: 'Keterangan', key: 'keterangan', width: 40 },
        { header: 'Nominal', key: 'nominal', width: 20 }
    ];
    
    sheetPengeluaran.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheetPengeluaran.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EF4444' } };
    
    pengeluaran.forEach(item => {
        const row = sheetPengeluaran.addRow({
            tanggal: new Date(item.tanggal).toLocaleString('id-ID'),
            bulan: item.bulan,
            keterangan: item.keterangan,
            nominal: item.nominal
        });
        row.getCell('nominal').numFmt = 'Rp #,##0';
    });
    
    // Sheet 3: Detail Pemasukan Lain-lain
    const sheetPemasukanLain = workbook.addWorksheet('Pemasukan Lain-lain');
    sheetPemasukanLain.columns = [
        { header: 'Tanggal', key: 'tanggal', width: 20 },
        { header: 'Bulan', key: 'bulan', width: 12 },
        { header: 'Keterangan', key: 'keterangan', width: 40 },
        { header: 'Nominal', key: 'nominal', width: 20 }
    ];
    
    sheetPemasukanLain.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheetPemasukanLain.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10B981' } };
    
    pemasukanLain.forEach(item => {
        const row = sheetPemasukanLain.addRow({
            tanggal: new Date(item.tanggal).toLocaleString('id-ID'),
            bulan: item.bulan,
            keterangan: item.keterangan,
            nominal: item.nominal
        });
        row.getCell('nominal').numFmt = 'Rp #,##0';
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Keuangan_Komplek_2026.xlsx');
    await workbook.xlsx.write(res);
    res.end();
});

app.listen(PORT, () => {
    console.log(`Sistem berjalan di http://localhost:${PORT}`);
});
module.exports = app;