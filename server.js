// Load .env untuk development lokal (di Vercel env vars diset via dashboard)
require('dotenv').config();

const express = require('express');
const path = require('path');
const ExcelJS = require('exceljs');
const cookieSession = require('cookie-session');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// KONFIGURASI SUPABASE
// Set environment variables di Vercel Dashboard:
//   SUPABASE_URL  = https://xxxx.supabase.co
//   SUPABASE_KEY  = service_role key (bukan anon key)
// ============================================================
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const TAHUN = 2026;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Setup Cookie Session — aman untuk Vercel serverless (tidak butuh memory store)
// Session disimpan di signed cookie di browser, tidak di server
app.use(cookieSession({
    name: 'iuran_session',
    keys: [process.env.SESSION_SECRET || 'kunci-rahasia-komplek'],
    maxAge: 8 * 60 * 60 * 1000, // 8 jam
    httpOnly: true,
    secure: false,   // false agar bekerja di Vercel (sudah HTTPS di level proxy)
    sameSite: 'lax'
}));

// Perbaikan agar session bisa di-save ulang setiap request (Vercel serverless)
app.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
    next();
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getBulanBerjalan() {
    const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return namaBulan[new Date().getMonth()];
}

function getAllBulan() {
    return ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
}

// Gabungkan data warga + status semua bulan menjadi format lama
// { id, no_rumah, nama, nominal_iuran, status_Jan, status_Feb, ... }
function mergeWargaDenganStatus(wargaRows, statusRows) {
    const statusMap = {};
    statusRows.forEach(s => {
        if (!statusMap[s.warga_id]) statusMap[s.warga_id] = {};
        statusMap[s.warga_id][s.bulan] = s.status;
    });

    return wargaRows.map(w => {
        const obj = {
            id: w.id,
            no_rumah: w.no_rumah,
            nama: w.nama,
            nominal_iuran: w.nominal_iuran
        };
        getAllBulan().forEach(bulan => {
            obj[`status_${bulan}`] = (statusMap[w.id] && statusMap[w.id][bulan]) || 'Belum Bayar';
        });
        return obj;
    });
}

function hitungKeuangan(warga, pengeluaran, pemasukanLain, bulan) {
    let totalPemasukanIuran = 0;
    warga.forEach(item => {
        if (item[`status_${bulan}`] === 'Lunas') {
            totalPemasukanIuran += item.nominal_iuran || 0;
        }
    });

    let totalPemasukanLain = 0;
    pemasukanLain.forEach(item => {
        if (item.bulan === bulan) totalPemasukanLain += item.nominal || 0;
    });

    const totalPemasukan = totalPemasukanIuran + totalPemasukanLain;

    let totalPengeluaran = 0;
    pengeluaran.forEach(item => {
        if (item.bulan === bulan) totalPengeluaran += item.nominal || 0;
    });

    return {
        totalPemasukanIuran,
        totalPemasukanLain,
        totalPemasukan,
        totalPengeluaran,
        sisaKas: totalPemasukan - totalPengeluaran
    };
}

function hitungKumulatifKas(warga, pengeluaran, pemasukanLain, sampaBulan) {
    const namaBulan = getAllBulan();
    const indexSampai = namaBulan.indexOf(sampaBulan);
    let totalKumulatif = 0;
    for (let i = 0; i <= indexSampai; i++) {
        const k = hitungKeuangan(warga, pengeluaran, pemasukanLain, namaBulan[i]);
        totalKumulatif += k.sisaKas;
    }
    return totalKumulatif;
}

// ============================================================
// MIDDLEWARE ADMIN
// ============================================================
function proteksiAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(403).send('Akses Ditolak: Anda harus login sebagai Admin.');
    }
}

// ============================================================
// ROUTES
// ============================================================

// Halaman Utama
app.get('/', async (req, res) => {
    try {
        // DEBUG SESSION — hapus setelah masalah terselesaikan
        console.log('[SESSION DEBUG] isAdmin:', req.session.isAdmin, '| adminNama:', req.session.adminNama);

        const bulanBerjalan = getBulanBerjalan();
        const semuaBulan = getAllBulan();

        // Ambil semua data paralel
        const [
            { data: wargaRows, error: errWarga },
            { data: statusRows, error: errStatus },
            { data: pengeluaran, error: errPengeluaran },
            { data: pemasukanLain, error: errPemasukanLain }
        ] = await Promise.all([
            supabase.from('warga').select('*').order('id'),
            supabase.from('iuran_status').select('*').eq('tahun', TAHUN),
            supabase.from('pengeluaran').select('*').eq('tahun', TAHUN).order('tanggal', { ascending: false }),
            supabase.from('pemasukan_lain').select('*').eq('tahun', TAHUN).order('tanggal', { ascending: false })
        ]);

        if (errWarga) throw errWarga;
        if (errStatus) throw errStatus;
        if (errPengeluaran) throw errPengeluaran;
        if (errPemasukanLain) throw errPemasukanLain;

        const warga = mergeWargaDenganStatus(wargaRows || [], statusRows || []);
        const keuangan = hitungKeuangan(warga, pengeluaran || [], pemasukanLain || [], bulanBerjalan);
        const totalKumulatif = hitungKumulatifKas(warga, pengeluaran || [], pemasukanLain || [], bulanBerjalan);

        const riwayatKeuangan = semuaBulan.map(bulan => {
            const k = hitungKeuangan(warga, pengeluaran || [], pemasukanLain || [], bulan);
            const kumulatif = hitungKumulatifKas(warga, pengeluaran || [], pemasukanLain || [], bulan);
            return {
                bulan,
                pemasukanIuran: k.totalPemasukanIuran,
                pemasukanLain: k.totalPemasukanLain,
                pemasukan: k.totalPemasukan,
                pengeluaran: k.totalPengeluaran,
                sisaKas: k.sisaKas,
                kumulatif
            };
        });

        res.render('index', {
            warga,
            isAdmin: req.session.isAdmin || false,
            adminNama: req.session.adminNama || null,
            bulanBerjalan,
            semuaBulan,
            pengeluaran: pengeluaran || [],
            pemasukanLain: pemasukanLain || [],
            keuangan,
            totalKumulatif,
            riwayatKeuangan,
            loginError: req.query.login_error === '1'
        });
    } catch (err) {
        console.error('Error GET /:', err);
        res.status(500).send('Terjadi kesalahan server: ' + err.message);
    }
});

// Login Admin
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.redirect('/?login_error=1');
        }

        // Verifikasi username + password langsung di PostgreSQL via pgcrypto
        // crypt() di sisi DB memastikan format hash konsisten ($2a$ dari pgcrypto)
        const { data, error } = await supabase.rpc('verify_admin_login', {
            p_username: username.trim().toLowerCase(),
            p_password: password
        });

        // DEBUG LOG — hapus setelah masalah terselesaikan
        console.log('[LOGIN DEBUG] username:', username.trim().toLowerCase());
        console.log('[LOGIN DEBUG] supabase error:', JSON.stringify(error));
        console.log('[LOGIN DEBUG] data:', JSON.stringify(data));
        console.log('[LOGIN DEBUG] SUPABASE_URL set:', !!process.env.SUPABASE_URL);
        console.log('[LOGIN DEBUG] SUPABASE_KEY set:', !!process.env.SUPABASE_KEY);

        if (error || !data || data.length === 0 || !data[0].valid) {
            console.log('[LOGIN DEBUG] login ditolak — error:', !!error, '| data kosong:', !data || data.length === 0, '| valid:', data && data[0] ? data[0].valid : 'N/A');
            return res.redirect('/?login_error=1');
        }

        const adminData = data[0];
        req.session.isAdmin = true;
        req.session.adminUsername = adminData.username;
        req.session.adminNama = adminData.nama_lengkap;

        // DEBUG SESSION — hapus setelah masalah terselesaikan
        console.log('[SESSION DEBUG] session setelah login:', JSON.stringify(req.session));

        // Update last_login
        await supabase
            .from('admin')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminData.id);

        res.redirect('/');
    } catch (err) {
        console.error('Error login:', err);
        res.redirect('/?login_error=1');
    }
});

// Logout Admin
app.get('/logout', (req, res) => {
    req.session = null; // cookie-session: set null untuk hapus session
    res.redirect('/');
});

// ============================================================
// CRUD WARGA (hanya Admin)
// ============================================================

// 1. Tambah Warga Baru
app.post('/tambah-warga', proteksiAdmin, async (req, res) => {
    try {
        const { no_rumah, nama, nominal_iuran } = req.body;
        const bulanBerjalan = getBulanBerjalan();

        // Insert warga
        const { data: wargaBaru, error: errWarga } = await supabase
            .from('warga')
            .insert({ no_rumah, nama, nominal_iuran: parseInt(nominal_iuran) || 50000 })
            .select()
            .single();

        if (errWarga) throw errWarga;

        // Buat status default "Belum Bayar" untuk semua bulan tahun ini
        const statusBatch = getAllBulan().map(bulan => ({
            warga_id: wargaBaru.id,
            bulan,
            tahun: TAHUN,
            status: 'Belum Bayar'
        }));

        const { error: errStatus } = await supabase
            .from('iuran_status')
            .insert(statusBatch);

        if (errStatus) throw errStatus;

        res.redirect('/');
    } catch (err) {
        console.error('Error tambah-warga:', err);
        res.status(500).send('Gagal tambah warga: ' + err.message);
    }
});

// 2. Update Status Iuran
app.post('/update-iuran', proteksiAdmin, async (req, res) => {
    try {
        const { id, bulan, status } = req.body;

        const { error } = await supabase
            .from('iuran_status')
            .upsert(
                { warga_id: parseInt(id), bulan, tahun: TAHUN, status },
                { onConflict: 'warga_id,bulan,tahun' }
            );

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error update-iuran:', err);
        res.status(500).send('Gagal update iuran: ' + err.message);
    }
});

// 3. Hapus Warga
app.post('/hapus-warga', proteksiAdmin, async (req, res) => {
    try {
        const { id } = req.body;

        // iuran_status akan terhapus otomatis karena ON DELETE CASCADE
        const { error } = await supabase
            .from('warga')
            .delete()
            .eq('id', parseInt(id));

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error hapus-warga:', err);
        res.status(500).send('Gagal hapus warga: ' + err.message);
    }
});

// 4. Edit Data Warga
app.post('/edit-warga', proteksiAdmin, async (req, res) => {
    try {
        const { id, no_rumah, nama, nominal_iuran } = req.body;

        const { error } = await supabase
            .from('warga')
            .update({
                no_rumah,
                nama,
                nominal_iuran: parseInt(nominal_iuran) || 50000
            })
            .eq('id', parseInt(id));

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error edit-warga:', err);
        res.status(500).send('Gagal edit warga: ' + err.message);
    }
});

// ============================================================
// PENGELUARAN (hanya Admin)
// ============================================================

// 5. Tambah Pengeluaran
app.post('/tambah-pengeluaran', proteksiAdmin, async (req, res) => {
    try {
        const { keterangan, nominal, bulan } = req.body;

        const { error } = await supabase
            .from('pengeluaran')
            .insert({
                keterangan,
                nominal: parseInt(nominal) || 0,
                bulan: bulan || getBulanBerjalan(),
                tahun: TAHUN,
                tanggal: new Date().toISOString()
            });

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error tambah-pengeluaran:', err);
        res.status(500).send('Gagal tambah pengeluaran: ' + err.message);
    }
});

// 6. Hapus Pengeluaran
app.post('/hapus-pengeluaran', proteksiAdmin, async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await supabase
            .from('pengeluaran')
            .delete()
            .eq('id', parseInt(id));

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error hapus-pengeluaran:', err);
        res.status(500).send('Gagal hapus pengeluaran: ' + err.message);
    }
});

// ============================================================
// PEMASUKAN LAIN (hanya Admin)
// ============================================================

// 7. Tambah Pemasukan Lain
app.post('/tambah-pemasukan-lain', proteksiAdmin, async (req, res) => {
    try {
        const { keterangan, nominal, bulan } = req.body;

        const { error } = await supabase
            .from('pemasukan_lain')
            .insert({
                keterangan,
                nominal: parseInt(nominal) || 0,
                bulan: bulan || getBulanBerjalan(),
                tahun: TAHUN,
                tanggal: new Date().toISOString()
            });

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error tambah-pemasukan-lain:', err);
        res.status(500).send('Gagal tambah pemasukan lain: ' + err.message);
    }
});

// 8. Hapus Pemasukan Lain
app.post('/hapus-pemasukan-lain', proteksiAdmin, async (req, res) => {
    try {
        const { id } = req.body;

        const { error } = await supabase
            .from('pemasukan_lain')
            .delete()
            .eq('id', parseInt(id));

        if (error) throw error;

        res.redirect('/');
    } catch (err) {
        console.error('Error hapus-pemasukan-lain:', err);
        res.status(500).send('Gagal hapus pemasukan lain: ' + err.message);
    }
});

// ============================================================
// DOWNLOAD EXCEL
// ============================================================

// Download Rekap Iuran (semua bulan)
app.get('/download-excel', async (req, res) => {
    try {
        const semuaBulan = getAllBulan();

        const [
            { data: wargaRows, error: errW },
            { data: statusRows, error: errS }
        ] = await Promise.all([
            supabase.from('warga').select('*').order('id'),
            supabase.from('iuran_status').select('*').eq('tahun', TAHUN)
        ]);

        if (errW) throw errW;
        if (errS) throw errS;

        const warga = mergeWargaDenganStatus(wargaRows || [], statusRows || []);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Laporan Iuran');

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
                const cell = row.getCell(`status_${bulan}`);
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
    } catch (err) {
        console.error('Error download-excel:', err);
        res.status(500).send('Gagal download excel: ' + err.message);
    }
});

// Download Excel per Bulan (Admin)
app.get('/download-excel-bulan/:bulan', proteksiAdmin, async (req, res) => {
    try {
        const { bulan } = req.params;

        const [
            { data: wargaRows, error: errW },
            { data: statusRows, error: errS }
        ] = await Promise.all([
            supabase.from('warga').select('*').order('id'),
            supabase.from('iuran_status').select('*').eq('tahun', TAHUN).eq('bulan', bulan)
        ]);

        if (errW) throw errW;
        if (errS) throw errS;

        const warga = mergeWargaDenganStatus(wargaRows || [], statusRows || []);

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
            const cell = row.getCell(`status_${bulan}`);
            if (cell.value === 'Lunas') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
                cell.font = { color: { argb: '15803D' } };
            } else if (cell.value === 'Belum Bayar') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
                cell.font = { color: { argb: 'B91C1C' } };
            }
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_Iuran_${bulan}_${TAHUN}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error download-excel-bulan:', err);
        res.status(500).send('Gagal download excel bulan: ' + err.message);
    }
});

// Download Laporan Keuangan Lengkap
app.get('/download-keuangan', async (req, res) => {
    try {
        const semuaBulan = getAllBulan();

        const [
            { data: wargaRows, error: errW },
            { data: statusRows, error: errS },
            { data: pengeluaran, error: errP },
            { data: pemasukanLain, error: errPL }
        ] = await Promise.all([
            supabase.from('warga').select('*').order('id'),
            supabase.from('iuran_status').select('*').eq('tahun', TAHUN),
            supabase.from('pengeluaran').select('*').eq('tahun', TAHUN).order('tanggal'),
            supabase.from('pemasukan_lain').select('*').eq('tahun', TAHUN).order('tanggal')
        ]);

        if (errW) throw errW;
        if (errS) throw errS;
        if (errP) throw errP;
        if (errPL) throw errPL;

        const warga = mergeWargaDenganStatus(wargaRows || [], statusRows || []);
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
            const k = hitungKeuangan(warga, pengeluaran || [], pemasukanLain || [], bulan);
            const kumulatif = hitungKumulatifKas(warga, pengeluaran || [], pemasukanLain || [], bulan);
            const row = sheetRingkasan.addRow({
                bulan,
                pemasukanIuran: k.totalPemasukanIuran,
                pemasukanLain: k.totalPemasukanLain,
                pemasukan: k.totalPemasukan,
                pengeluaran: k.totalPengeluaran,
                sisa: k.sisaKas,
                kumulatif
            });
            ['pemasukanIuran', 'pemasukanLain', 'pemasukan', 'pengeluaran', 'sisa', 'kumulatif'].forEach(key => {
                row.getCell(key).numFmt = 'Rp #,##0';
            });
            if (k.sisaKas < 0) {
                row.getCell('sisa').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
                row.getCell('sisa').font = { color: { argb: 'B91C1C' } };
            } else {
                row.getCell('sisa').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
                row.getCell('sisa').font = { color: { argb: '15803D' } };
            }
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
        (pengeluaran || []).forEach(item => {
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
        (pemasukanLain || []).forEach(item => {
            const row = sheetPemasukanLain.addRow({
                tanggal: new Date(item.tanggal).toLocaleString('id-ID'),
                bulan: item.bulan,
                keterangan: item.keterangan,
                nominal: item.nominal
            });
            row.getCell('nominal').numFmt = 'Rp #,##0';
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_Keuangan_Komplek_${TAHUN}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error download-keuangan:', err);
        res.status(500).send('Gagal download keuangan: ' + err.message);
    }
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`Sistem berjalan di http://localhost:${PORT}`);
});

module.exports = app;
