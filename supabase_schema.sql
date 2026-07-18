-- ============================================================
-- SCHEMA SUPABASE untuk Aplikasi Iuran Komplek Masihiro
-- Aman dijalankan berkali-kali (idempotent)
-- ============================================================

-- Extension pgcrypto untuk bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABEL
-- ============================================================

CREATE TABLE IF NOT EXISTS warga (
    id SERIAL PRIMARY KEY,
    no_rumah VARCHAR(20) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nominal_iuran INTEGER NOT NULL DEFAULT 50000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iuran_status (
    id SERIAL PRIMARY KEY,
    warga_id INTEGER NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
    bulan VARCHAR(10) NOT NULL,
    tahun INTEGER NOT NULL DEFAULT 2026,
    status VARCHAR(20) NOT NULL DEFAULT 'Belum Bayar',
    UNIQUE(warga_id, bulan, tahun)
);

CREATE TABLE IF NOT EXISTS pengeluaran (
    id SERIAL PRIMARY KEY,
    keterangan TEXT NOT NULL,
    nominal INTEGER NOT NULL DEFAULT 0,
    bulan VARCHAR(10) NOT NULL,
    tahun INTEGER NOT NULL DEFAULT 2026,
    tanggal TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pemasukan_lain (
    id SERIAL PRIMARY KEY,
    keterangan TEXT NOT NULL,
    nominal INTEGER NOT NULL DEFAULT 0,
    bulan VARCHAR(10) NOT NULL,
    tahun INTEGER NOT NULL DEFAULT 2026,
    tanggal TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nama_lengkap VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- ============================================================
-- INDEX
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_admin_username        ON admin(username);
CREATE INDEX IF NOT EXISTS idx_iuran_status_warga    ON iuran_status(warga_id);
CREATE INDEX IF NOT EXISTS idx_iuran_status_bulan    ON iuran_status(bulan, tahun);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_bulan     ON pengeluaran(bulan, tahun);
CREATE INDEX IF NOT EXISTS idx_pemasukan_lain_bulan  ON pemasukan_lain(bulan, tahun);

-- ============================================================
-- ROW LEVEL SECURITY
-- Gunakan DROP ... IF EXISTS sebelum CREATE supaya aman dijalankan ulang
-- ============================================================
ALTER TABLE warga          ENABLE ROW LEVEL SECURITY;
ALTER TABLE iuran_status   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengeluaran    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pemasukan_lain ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin          ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON warga;
DROP POLICY IF EXISTS "Allow all for service role" ON iuran_status;
DROP POLICY IF EXISTS "Allow all for service role" ON pengeluaran;
DROP POLICY IF EXISTS "Allow all for service role" ON pemasukan_lain;
DROP POLICY IF EXISTS "Allow all for service role" ON admin;

CREATE POLICY "Allow all for service role" ON warga          FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON iuran_status   FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON pengeluaran    FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON pemasukan_lain FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON admin          FOR ALL USING (true);

-- ============================================================
-- DATA AWAL: 43 Warga
-- ============================================================
INSERT INTO warga (id, no_rumah, nama, nominal_iuran) VALUES
(1,  'B-01', 'Agung',            100000),
(2,  'B-02', 'Boby',             100000),
(3,  'B-03', 'Pak Tasliki',      100000),
(4,  'B-04', 'Jufri',            100000),
(5,  'B-05', 'Hartono',          100000),
(6,  'B-07', 'Pak Ari',          100000),
(7,  'B-09', 'Acai',              50000),
(8,  'B-10', 'Jack',             100000),
(9,  'B-11', 'Dimas',            100000),
(10, 'B-12', 'Zenabel',          100000),
(11, 'B-13', 'Ari',              100000),
(12, 'B-14', 'Alfan',            100000),
(13, 'B-15', 'Suriadi',          100000),
(14, 'B-16', 'Apriyadi',         100000),
(15, 'B-17', 'Hendro',           100000),
(16, 'B-18', 'Rico',             100000),
(17, 'B-19', 'Bahtiar',          100000),
(18, 'B-20', 'Nababan',           50000),
(19, 'B-21', 'Anto',              50000),
(20, 'B-22', 'Jimmy',            100000),
(21, 'B-23', 'Amri',              50000),
(22, 'B-24', 'Dika',             100000),
(23, 'C-01', 'Albert Sitompul',   50000),
(24, 'C-02', 'Fandi',             50000),
(25, 'C-03', 'Bambang',           50000),
(26, 'C-04', 'Oky',               50000),
(27, 'D-02', 'Putra Pinaldi',     50000),
(28, 'D-04', 'Imam',              50000),
(29, 'D-05', 'Syawal',            50000),
(30, 'D-06', 'Elva',              50000),
(31, 'D-07', 'Ayu',              100000),
(32, 'D-08', 'Yono/Kakek Bakso',  50000),
(33, 'D-09', 'Joko',              50000),
(34, 'D-10', 'Rindo',             50000),
(35, 'D-11', 'Reza',              50000),
(36, 'D-14', 'Usman',             30000),
(37, 'D-15', 'Zulfadli',         100000),
(38, 'D-16', 'Vita',              50000),
(39, 'D-17', 'Mirza',             50000),
(40, 'D-18', 'Dewata',            50000),
(41, 'D-19', 'Pak Fino',          30000),
(42, 'D-20', 'Iqbal',             50000),
(43, 'D-21', 'Kek Ismet',        100000)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence agar id berikutnya tidak bentrok
SELECT setval('warga_id_seq', (SELECT MAX(id) FROM warga));

-- ============================================================
-- DATA AWAL: Status iuran semua bulan
-- Jul = Lunas untuk semua warga kecuali id 29 (Syawal)
-- ============================================================
INSERT INTO iuran_status (warga_id, bulan, tahun, status)
SELECT
    w.id,
    b.bulan,
    2026,
    CASE WHEN b.bulan = 'Jul' AND w.id != 29 THEN 'Lunas' ELSE 'Belum Bayar' END
FROM warga w
CROSS JOIN (VALUES
    ('Jan'),('Feb'),('Mar'),('Apr'),('Mei'),('Jun'),
    ('Jul'),('Agu'),('Sep'),('Okt'),('Nov'),('Des')
) AS b(bulan)
ON CONFLICT (warga_id, bulan, tahun) DO NOTHING;

-- ============================================================
-- DATA AWAL: Akun Admin
-- Username : admin
-- Password : masahiro123
-- Ganti password: UPDATE admin SET password_hash = crypt('baru', gen_salt('bf',12)) WHERE username = 'admin';
-- ============================================================
INSERT INTO admin (username, password_hash, nama_lengkap)
VALUES (
    'admin',
    crypt('masahiro123', gen_salt('bf', 12)),
    'Administrator Komplek Masihiro'
)
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- FUNCTION: Verifikasi login admin dari Node.js
-- ============================================================
CREATE OR REPLACE FUNCTION verify_admin_login(p_username TEXT, p_password TEXT)
RETURNS TABLE(id INT, username VARCHAR, nama_lengkap VARCHAR, valid BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.username,
        a.nama_lengkap,
        (a.password_hash = crypt(p_password, a.password_hash)) AS valid
    FROM admin a
    WHERE a.username = p_username;
END;
$$;
