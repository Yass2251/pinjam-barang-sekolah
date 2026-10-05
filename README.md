# SIPINJAM — Sistem Peminjaman Barang Sekolah

Aplikasi web sederhana untuk pencatatan dan pengelolaan peminjaman barang sekolah oleh guru piket / staf sarana dan prasarana.

## 🚀 Fitur Utama

1. **Dashboard**
   - Statistik Total Barang, Barang Tersedia, dan Sedang Dipinjam.
   - Tabel 5 riwayat peminjaman terbaru.
2. **Data Barang (CRUD)**
   - Menampilkan barang dalam bentuk card rapi lengkap dengan foto.
   - Tambah barang baru (Nama, Kategori, Jumlah, Kondisi, Foto dari komputer).
   - Edit data barang.
   - Hapus barang dengan konfirmasi.
   - Status otomatis (Tersedia / Habis) berdasarkan ketersediaan stok.
3. **Peminjaman & Pengembalian**
   - Tambah peminjaman siswa (Nama, Kelas, Pilih Barang, Jumlah, Tgl Pinjam, Tgl Kembali).
   - Validasi stok barang otomatis.
   - Tombol pengembalian barang langsung mengembalikan stok dan memperbarui statistik.
   - Riwayat peminjaman dapat diedit dan dihapus.
4. **LocalStorage**
   - Semua data tersimpan aman di browser (tidak hilang saat di-refresh).
5. **Responsif & Modern**
   - Tampilan bersih dengan font Poppins, layout adaptif untuk desktop, tablet, maupun smartphone.

## 🛠️ Teknologi

- **HTML5**
- **Vanilla CSS**
- **JavaScript (ES6+)**
- **LocalStorage API**

## 💻 Cara Menjalankan

Cukup buka file `index.html` langsung di web browser (Chrome, Edge, Firefox, dsb) tanpa perlu web server atau backend.
