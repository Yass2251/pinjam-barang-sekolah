// ============================================================
// SIPINJAM — Peminjaman Barang Sekolah
// Menggunakan JavaScript + LocalStorage
// ============================================================

// ===== HELPER FUNCTIONS =====

/**
 * Menghasilkan ID unik sederhana
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * Format tanggal ke format Indonesia (DD/MM/YYYY)
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Tampilkan notifikasi toast
 */
function showToast(message, isError = false) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast' + (isError ? ' toast-error' : '');
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="${isError ? '#EF4444' : '#22C55E'}">
            ${isError
                ? '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
                : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>'
            }
        </svg>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Tampilkan dialog konfirmasi dengan teks dan warna tombol dinamis
 */
function showConfirm(options, onConfirm) {
    const opts = typeof options === 'string'
        ? { message: options, title: 'Konfirmasi', confirmText: 'Hapus', confirmClass: 'btn-danger', iconType: 'danger' }
        : {
            title: 'Konfirmasi',
            message: 'Apakah kamu yakin?',
            confirmText: 'Ya, Lanjutkan',
            confirmClass: 'btn-primary',
            iconType: 'danger',
            ...options
        };

    const overlay = document.getElementById('confirmDialog');
    const titleEl = document.getElementById('confirmTitle');
    const msgEl = document.getElementById('confirmMessage');
    const iconEl = document.getElementById('confirmIcon');
    const btnOk = document.getElementById('confirmOk');
    const btnCancel = document.getElementById('confirmCancel');

    if (titleEl) titleEl.textContent = opts.title;
    if (msgEl) msgEl.textContent = opts.message;

    // Set icon & class
    if (iconEl) {
        if (opts.iconType === 'success') {
            iconEl.className = 'confirm-icon success';
            iconEl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';
        } else if (opts.iconType === 'info') {
            iconEl.className = 'confirm-icon info';
            iconEl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
        } else {
            iconEl.className = 'confirm-icon';
            iconEl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
        }
    }

    // Set confirm button text & class
    btnOk.className = `btn ${opts.confirmClass}`;
    btnOk.textContent = opts.confirmText;

    overlay.classList.add('active');

    // Clone buttons to remove old event listeners
    const newOk = btnOk.cloneNode(true);
    const newCancel = btnCancel.cloneNode(true);
    btnOk.parentNode.replaceChild(newOk, btnOk);
    btnCancel.parentNode.replaceChild(newCancel, btnCancel);

    newOk.addEventListener('click', () => {
        overlay.classList.remove('active');
        onConfirm();
    });

    newCancel.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
}

// ===== LOCAL STORAGE OPERATIONS =====

function getBarangList() {
    return JSON.parse(localStorage.getItem('sipinjam_barang') || '[]');
}

function saveBarangList(list) {
    localStorage.setItem('sipinjam_barang', JSON.stringify(list));
}

function getPeminjamanList() {
    return JSON.parse(localStorage.getItem('sipinjam_peminjaman') || '[]');
}

function savePeminjamanList(list) {
    localStorage.setItem('sipinjam_peminjaman', JSON.stringify(list));
}

// ===== DATA AWAL (SEED DATA) =====

const defaultImages = {
    'Proyektor': 'assets/images/proyektor.png',
    'Laptop': 'assets/images/laptop.png',
    'Speaker': 'assets/images/speaker.png',
    'Kamera': 'assets/images/kamera.png',
    'Mikrofon': 'assets/images/mikrofon.png',
    'Tripod': 'assets/images/tripod.png'
};

function seedData() {
    if (!localStorage.getItem('sipinjam_seeded')) {
        const barangAwal = [
            {
                id: generateId(),
                nama: 'Proyektor',
                kategori: 'Elektronik',
                jumlah: 5,
                tersedia: 4,
                kondisi: 'Baik',
                foto: defaultImages['Proyektor'] || ''
            },
            {
                id: generateId(),
                nama: 'Laptop',
                kategori: 'Elektronik',
                jumlah: 10,
                tersedia: 8,
                kondisi: 'Baik',
                foto: defaultImages['Laptop'] || ''
            },
            {
                id: generateId(),
                nama: 'Speaker',
                kategori: 'Multimedia',
                jumlah: 3,
                tersedia: 3,
                kondisi: 'Baik',
                foto: defaultImages['Speaker'] || ''
            },
            {
                id: generateId(),
                nama: 'Kamera',
                kategori: 'Multimedia',
                jumlah: 4,
                tersedia: 3,
                kondisi: 'Baik',
                foto: defaultImages['Kamera'] || ''
            },
            {
                id: generateId(),
                nama: 'Mikrofon',
                kategori: 'Multimedia',
                jumlah: 6,
                tersedia: 5,
                kondisi: 'Baik',
                foto: defaultImages['Mikrofon'] || ''
            },
            {
                id: generateId(),
                nama: 'Tripod',
                kategori: 'Multimedia',
                jumlah: 4,
                tersedia: 4,
                kondisi: 'Baik',
                foto: defaultImages['Tripod'] || ''
            }
        ];

        saveBarangList(barangAwal);

        // Beberapa peminjaman contoh
        const peminjamanAwal = [
            {
                id: generateId(),
                namaPeminjam: 'Ahmad Fauzi',
                kelas: 'XII RPL 1',
                barangId: barangAwal[0].id,
                barangNama: 'Proyektor',
                jumlah: 1,
                tglPinjam: '2026-10-01',
                tglKembali: '2026-10-05',
                status: 'Dipinjam'
            },
            {
                id: generateId(),
                namaPeminjam: 'Siti Nurhaliza',
                kelas: 'XI TKJ 2',
                barangId: barangAwal[1].id,
                barangNama: 'Laptop',
                jumlah: 2,
                tglPinjam: '2026-10-02',
                tglKembali: '2026-10-04',
                status: 'Dipinjam'
            },
            {
                id: generateId(),
                namaPeminjam: 'Budi Santoso',
                kelas: 'X MM 1',
                barangId: barangAwal[3].id,
                barangNama: 'Kamera',
                jumlah: 1,
                tglPinjam: '2026-09-28',
                tglKembali: '2026-10-01',
                status: 'Dikembalikan'
            },
            {
                id: generateId(),
                namaPeminjam: 'Dewi Lestari',
                kelas: 'XII RPL 2',
                barangId: barangAwal[4].id,
                barangNama: 'Mikrofon',
                jumlah: 1,
                tglPinjam: '2026-10-03',
                tglKembali: '2026-10-06',
                status: 'Dipinjam'
            }
        ];

        savePeminjamanList(peminjamanAwal);
        localStorage.setItem('sipinjam_seeded', 'true');
    } else {
        // Jika data sudah pernah di-seed sebelumnya tanpa foto, update foto barang default
        const barangList = getBarangList();
        let updated = false;
        barangList.forEach(b => {
            if ((!b.foto || b.foto === '') && defaultImages[b.nama]) {
                b.foto = defaultImages[b.nama];
                updated = true;
            }
        });
        if (updated) {
            saveBarangList(barangList);
        }
    }
}

// ===== NAVIGATION =====

const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburgerBtn = document.getElementById('hamburgerBtn');

function navigateTo(pageName) {
    // Update nav links
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });

    // Show correct page
    pages.forEach(page => {
        page.classList.toggle('active', page.id === 'page-' + pageName);
    });

    // Close sidebar on mobile
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');

    // Refresh page data
    if (pageName === 'dashboard') renderDashboard();
    if (pageName === 'barang') renderBarangGrid();
    if (pageName === 'peminjaman') renderPeminjamanTable();
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// Mobile sidebar toggle
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

// ===== DASHBOARD =====

function renderDashboard() {
    const barangList = getBarangList();
    const peminjamanList = getPeminjamanList();

    // Hitung statistik
    const totalBarang = barangList.reduce((sum, b) => sum + b.jumlah, 0);
    const totalTersedia = barangList.reduce((sum, b) => sum + b.tersedia, 0);
    const sedangDipinjam = totalBarang - totalTersedia;

    document.getElementById('stat-total').textContent = totalBarang;
    document.getElementById('stat-tersedia').textContent = totalTersedia;
    document.getElementById('stat-dipinjam').textContent = sedangDipinjam;

    // Peminjaman terbaru (5 terakhir)
    const recent = [...peminjamanList].reverse().slice(0, 5);
    const tbody = document.getElementById('dashboard-recent-table');

    if (recent.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                        <h4>Belum ada peminjaman</h4>
                        <p>Data peminjaman akan muncul di sini</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = recent.map(p => `
        <tr>
            <td>${p.namaPeminjam}</td>
            <td>${p.kelas}</td>
            <td>${p.barangNama}</td>
            <td>${formatDate(p.tglPinjam)}</td>
            <td>
                <span class="badge ${p.status === 'Dipinjam' ? 'badge-danger' : 'badge-success'}">
                    ${p.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// ===== DATA BARANG - RENDER =====

/**
 * SVG placeholder untuk barang tanpa foto
 */
function getPlaceholderSVG() {
    return `
        <div class="placeholder-icon">
            <svg viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        </div>
    `;
}

function renderBarangGrid() {
    const barangList = getBarangList();
    const grid = document.getElementById('barangGrid');

    if (barangList.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9v-2h4V5h2v4h4v2z"/></svg>
                <h4>Belum ada barang</h4>
                <p>Klik "Tambah Barang" untuk menambahkan data</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = barangList.map(b => {
        // Tentukan status berdasarkan ketersediaan
        let statusBadge;
        if (b.tersedia > 0) {
            statusBadge = '<span class="badge badge-success">Tersedia</span>';
        } else {
            statusBadge = '<span class="badge badge-danger">Habis</span>';
        }

        // Tentukan badge kondisi
        let kondisiBadge;
        if (b.kondisi === 'Baik') {
            kondisiBadge = '<span class="badge badge-success">Baik</span>';
        } else if (b.kondisi === 'Rusak Ringan') {
            kondisiBadge = '<span class="badge badge-warning">Rusak Ringan</span>';
        } else {
            kondisiBadge = '<span class="badge badge-danger">Rusak</span>';
        }

        const imgContent = b.foto
            ? `<img src="${b.foto}" alt="${b.nama}">`
            : getPlaceholderSVG();

        return `
            <div class="barang-card">
                <div class="barang-card-img">
                    ${imgContent}
                </div>
                <div class="barang-card-body">
                    <h4>${b.nama}</h4>
                    <div class="barang-meta">
                        <div class="barang-meta-item">
                            <span class="label">Kategori</span>
                            <span class="value">${b.kategori}</span>
                        </div>
                        <div class="barang-meta-item">
                            <span class="label">Jumlah Total</span>
                            <span class="value">${b.jumlah}</span>
                        </div>
                        <div class="barang-meta-item">
                            <span class="label">Tersedia</span>
                            <span class="value">${b.tersedia}</span>
                        </div>
                        <div class="barang-meta-item">
                            <span class="label">Kondisi</span>
                            ${kondisiBadge}
                        </div>
                        <div class="barang-meta-item">
                            <span class="label">Status</span>
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="barang-card-footer">
                        <button class="btn btn-outline btn-sm" onclick="editBarang('${b.id}')">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBarang('${b.id}')">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== DATA BARANG - CRUD =====

const modalBarang = document.getElementById('modalBarang');
const formBarang = document.getElementById('formBarang');
const btnTambahBarang = document.getElementById('btnTambahBarang');
const closeModalBarang = document.getElementById('closeModalBarang');
const cancelBarang = document.getElementById('cancelBarang');
const saveBarang = document.getElementById('saveBarang');
const fotoPreview = document.getElementById('fotoPreview');
const barangFotoInput = document.getElementById('barangFoto');

function openBarangModal(title = 'Tambah Barang') {
    document.getElementById('modalBarangTitle').textContent = title;
    modalBarang.classList.add('active');
}

function closeBarangModal() {
    modalBarang.classList.remove('active');
    formBarang.reset();
    document.getElementById('barangId').value = '';
    fotoPreview.classList.remove('active');
    fotoPreview.src = '';
}

btnTambahBarang.addEventListener('click', () => {
    closeBarangModal(); // reset first
    openBarangModal('Tambah Barang');
});

closeModalBarang.addEventListener('click', closeBarangModal);
cancelBarang.addEventListener('click', closeBarangModal);

// Tutup modal kalau klik di luar
modalBarang.addEventListener('click', (e) => {
    if (e.target === modalBarang) closeBarangModal();
});

// Preview foto
barangFotoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            showToast('Ukuran file terlalu besar. Maksimal 2MB.', true);
            this.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            fotoPreview.src = e.target.result;
            fotoPreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
});

// Simpan barang
saveBarang.addEventListener('click', () => {
    const id = document.getElementById('barangId').value;
    const nama = document.getElementById('barangNama').value.trim();
    const kategori = document.getElementById('barangKategori').value;
    const jumlah = parseInt(document.getElementById('barangJumlah').value);
    const kondisi = document.getElementById('barangKondisi').value;

    // Validasi
    if (!nama || !kategori || isNaN(jumlah) || jumlah < 0 || !kondisi) {
        showToast('Mohon lengkapi semua field yang wajib diisi.', true);
        return;
    }

    const barangList = getBarangList();

    if (id) {
        // UPDATE
        const index = barangList.findIndex(b => b.id === id);
        if (index !== -1) {
            const oldJumlah = barangList[index].jumlah;
            const oldTersedia = barangList[index].tersedia;
            const dipinjam = oldJumlah - oldTersedia;
            const newTersedia = Math.max(0, jumlah - dipinjam);

            barangList[index].nama = nama;
            barangList[index].kategori = kategori;
            barangList[index].jumlah = jumlah;
            barangList[index].tersedia = newTersedia;
            barangList[index].kondisi = kondisi;

            // Update foto jika ada file baru
            if (fotoPreview.src && fotoPreview.classList.contains('active') && barangFotoInput.files.length > 0) {
                barangList[index].foto = fotoPreview.src;
            }

            // Update nama barang di peminjaman
            const peminjamanList = getPeminjamanList();
            peminjamanList.forEach(p => {
                if (p.barangId === id) {
                    p.barangNama = nama;
                }
            });
            savePeminjamanList(peminjamanList);

            saveBarangList(barangList);
            showToast('Barang berhasil diperbarui.');
        }
    } else {
        // CREATE
        const newBarang = {
            id: generateId(),
            nama,
            kategori,
            jumlah,
            tersedia: jumlah,
            kondisi,
            foto: fotoPreview.src && fotoPreview.classList.contains('active') ? fotoPreview.src : ''
        };
        barangList.push(newBarang);
        saveBarangList(barangList);
        showToast('Barang berhasil ditambahkan.');
    }

    closeBarangModal();
    renderBarangGrid();
});

// Edit barang
function editBarang(id) {
    const barangList = getBarangList();
    const barang = barangList.find(b => b.id === id);
    if (!barang) return;

    document.getElementById('barangId').value = barang.id;
    document.getElementById('barangNama').value = barang.nama;
    document.getElementById('barangKategori').value = barang.kategori;
    document.getElementById('barangJumlah').value = barang.jumlah;
    document.getElementById('barangKondisi').value = barang.kondisi;

    if (barang.foto) {
        fotoPreview.src = barang.foto;
        fotoPreview.classList.add('active');
    } else {
        fotoPreview.classList.remove('active');
        fotoPreview.src = '';
    }

    openBarangModal('Edit Barang');
}

// Hapus barang
function deleteBarang(id) {
    showConfirm({
        title: 'Konfirmasi Hapus Barang',
        message: 'Apakah kamu yakin ingin menghapus barang ini?',
        confirmText: 'Hapus',
        confirmClass: 'btn-danger',
        iconType: 'danger'
    }, () => {
        let barangList = getBarangList();
        barangList = barangList.filter(b => b.id !== id);
        saveBarangList(barangList);
        renderBarangGrid();
        showToast('Barang berhasil dihapus.');
    });
}

// ===== PEMINJAMAN - RENDER =====

function renderPeminjamanTable() {
    const peminjamanList = getPeminjamanList();
    const tbody = document.getElementById('peminjamanTable');

    if (peminjamanList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                        <h4>Belum ada peminjaman</h4>
                        <p>Klik "Tambah Peminjaman" untuk menambahkan data</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = peminjamanList.map(p => {
        const isDipinjam = p.status === 'Dipinjam';
        return `
            <tr>
                <td>${p.namaPeminjam}</td>
                <td>${p.kelas}</td>
                <td>${p.barangNama}</td>
                <td>${p.jumlah}</td>
                <td>${formatDate(p.tglPinjam)}</td>
                <td>${formatDate(p.tglKembali)}</td>
                <td>
                    <span class="badge ${isDipinjam ? 'badge-danger' : 'badge-success'}">
                        ${p.status}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-outline btn-sm btn-icon" title="Edit" onclick="editPinjam('${p.id}')">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        ${isDipinjam ? `
                            <button class="btn btn-success btn-sm btn-icon" title="Kembalikan" onclick="kembalikanBarang('${p.id}')">
                                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                            </button>
                        ` : ''}
                        <button class="btn btn-danger btn-sm btn-icon" title="Hapus" onclick="deletePinjam('${p.id}')">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== PEMINJAMAN - CRUD =====

const modalPinjam = document.getElementById('modalPinjam');
const formPinjam = document.getElementById('formPinjam');
const btnTambahPinjam = document.getElementById('btnTambahPinjam');
const closeModalPinjam = document.getElementById('closeModalPinjam');
const cancelPinjam = document.getElementById('cancelPinjam');
const savePinjam = document.getElementById('savePinjam');
const pinjamBarangSelect = document.getElementById('pinjamBarang');
const stockInfo = document.getElementById('stockInfo');

function populateBarangSelect(excludeId) {
    const barangList = getBarangList();
    pinjamBarangSelect.innerHTML = '<option value="">Pilih Barang</option>';

    barangList.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = `${b.nama} (tersedia: ${b.tersedia})`;
        if (b.tersedia <= 0 && b.id !== excludeId) {
            option.disabled = true;
        }
        pinjamBarangSelect.appendChild(option);
    });
}

function openPinjamModal(title = 'Tambah Peminjaman') {
    document.getElementById('modalPinjamTitle').textContent = title;
    populateBarangSelect();
    modalPinjam.classList.add('active');

    // Set tanggal hari ini sebagai default
    if (!document.getElementById('pinjamTglPinjam').value) {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pinjamTglPinjam').value = today;
    }
}

function closePinjamModal() {
    modalPinjam.classList.remove('active');
    formPinjam.reset();
    document.getElementById('pinjamId').value = '';
    stockInfo.classList.remove('show');
}

btnTambahPinjam.addEventListener('click', () => {
    closePinjamModal();
    openPinjamModal('Tambah Peminjaman');
});

closeModalPinjam.addEventListener('click', closePinjamModal);
cancelPinjam.addEventListener('click', closePinjamModal);

modalPinjam.addEventListener('click', (e) => {
    if (e.target === modalPinjam) closePinjamModal();
});

// Tampilkan stok saat barang dipilih
pinjamBarangSelect.addEventListener('change', function () {
    const barangList = getBarangList();
    const barang = barangList.find(b => b.id === this.value);

    if (barang) {
        stockInfo.textContent = `Stok tersedia: ${barang.tersedia}`;
        stockInfo.classList.add('show');
        stockInfo.classList.toggle('out-of-stock', barang.tersedia <= 0);
        document.getElementById('pinjamJumlah').max = barang.tersedia;
    } else {
        stockInfo.classList.remove('show');
    }
});

// Simpan peminjaman
savePinjam.addEventListener('click', () => {
    const id = document.getElementById('pinjamId').value;
    const namaPeminjam = document.getElementById('pinjamNama').value.trim();
    const kelas = document.getElementById('pinjamKelas').value.trim();
    const barangId = pinjamBarangSelect.value;
    const jumlah = parseInt(document.getElementById('pinjamJumlah').value);
    const tglPinjam = document.getElementById('pinjamTglPinjam').value;
    const tglKembali = document.getElementById('pinjamTglKembali').value;

    // Validasi
    if (!namaPeminjam || !kelas || !barangId || isNaN(jumlah) || jumlah < 1 || !tglPinjam || !tglKembali) {
        showToast('Mohon lengkapi semua field yang wajib diisi.', true);
        return;
    }

    const barangList = getBarangList();
    const barang = barangList.find(b => b.id === barangId);

    if (!barang) {
        showToast('Barang tidak ditemukan.', true);
        return;
    }

    const peminjamanList = getPeminjamanList();

    if (id) {
        // UPDATE
        const index = peminjamanList.findIndex(p => p.id === id);
        if (index !== -1) {
            const oldPinjam = peminjamanList[index];

            // Kembalikan stok dari peminjaman lama (jika masih dipinjam)
            if (oldPinjam.status === 'Dipinjam') {
                const oldBarang = barangList.find(b => b.id === oldPinjam.barangId);
                if (oldBarang) {
                    oldBarang.tersedia += oldPinjam.jumlah;
                }
            }

            // Cek stok untuk peminjaman baru
            const updatedBarang = barangList.find(b => b.id === barangId);
            if (updatedBarang && jumlah > updatedBarang.tersedia) {
                // Rollback stok
                if (oldPinjam.status === 'Dipinjam') {
                    const oldBarang2 = barangList.find(b => b.id === oldPinjam.barangId);
                    if (oldBarang2) {
                        oldBarang2.tersedia -= oldPinjam.jumlah;
                    }
                }
                showToast(`Stok tidak cukup. Tersedia: ${updatedBarang.tersedia}`, true);
                return;
            }

            // Kurangi stok baru (jika masih dipinjam)
            if (oldPinjam.status === 'Dipinjam' && updatedBarang) {
                updatedBarang.tersedia -= jumlah;
            }

            peminjamanList[index].namaPeminjam = namaPeminjam;
            peminjamanList[index].kelas = kelas;
            peminjamanList[index].barangId = barangId;
            peminjamanList[index].barangNama = barang.nama;
            peminjamanList[index].jumlah = jumlah;
            peminjamanList[index].tglPinjam = tglPinjam;
            peminjamanList[index].tglKembali = tglKembali;

            saveBarangList(barangList);
            savePeminjamanList(peminjamanList);
            showToast('Peminjaman berhasil diperbarui.');
        }
    } else {
        // CREATE
        if (jumlah > barang.tersedia) {
            showToast(`Stok tidak cukup. Tersedia: ${barang.tersedia}`, true);
            return;
        }

        // Kurangi stok
        barang.tersedia -= jumlah;

        const newPinjam = {
            id: generateId(),
            namaPeminjam,
            kelas,
            barangId,
            barangNama: barang.nama,
            jumlah,
            tglPinjam,
            tglKembali,
            status: 'Dipinjam'
        };

        peminjamanList.push(newPinjam);
        saveBarangList(barangList);
        savePeminjamanList(peminjamanList);
        showToast('Peminjaman berhasil ditambahkan.');
    }

    closePinjamModal();
    renderPeminjamanTable();
});

// Edit peminjaman
function editPinjam(id) {
    const peminjamanList = getPeminjamanList();
    const pinjam = peminjamanList.find(p => p.id === id);
    if (!pinjam) return;

    // Populate select first with the current barang available
    populateBarangSelect(pinjam.barangId);

    document.getElementById('pinjamId').value = pinjam.id;
    document.getElementById('pinjamNama').value = pinjam.namaPeminjam;
    document.getElementById('pinjamKelas').value = pinjam.kelas;
    pinjamBarangSelect.value = pinjam.barangId;
    document.getElementById('pinjamJumlah').value = pinjam.jumlah;
    document.getElementById('pinjamTglPinjam').value = pinjam.tglPinjam;
    document.getElementById('pinjamTglKembali').value = pinjam.tglKembali;

    // Trigger stock info
    pinjamBarangSelect.dispatchEvent(new Event('change'));

    openPinjamModal('Edit Peminjaman');
}

// Kembalikan barang
function kembalikanBarang(id) {
    showConfirm({
        title: 'Konfirmasi Pengembalian',
        message: 'Apakah kamu yakin ingin mengembalikan barang ini?',
        confirmText: 'Kembalikan',
        confirmClass: 'btn-success',
        iconType: 'success'
    }, () => {
        const peminjamanList = getPeminjamanList();
        const barangList = getBarangList();

        const pinjam = peminjamanList.find(p => p.id === id);
        if (!pinjam || pinjam.status === 'Dikembalikan') return;

        // Update status
        pinjam.status = 'Dikembalikan';

        // Kembalikan stok
        const barang = barangList.find(b => b.id === pinjam.barangId);
        if (barang) {
            barang.tersedia += pinjam.jumlah;
        }

        saveBarangList(barangList);
        savePeminjamanList(peminjamanList);
        renderPeminjamanTable();
        showToast('Barang berhasil dikembalikan.');
    });
}

// Hapus peminjaman
function deletePinjam(id) {
    showConfirm({
        title: 'Konfirmasi Hapus Peminjaman',
        message: 'Apakah kamu yakin ingin menghapus peminjaman ini?',
        confirmText: 'Hapus',
        confirmClass: 'btn-danger',
        iconType: 'danger'
    }, () => {
        let peminjamanList = getPeminjamanList();
        const barangList = getBarangList();

        const pinjam = peminjamanList.find(p => p.id === id);
        if (pinjam && pinjam.status === 'Dipinjam') {
            // Kembalikan stok jika masih dipinjam
            const barang = barangList.find(b => b.id === pinjam.barangId);
            if (barang) {
                barang.tersedia += pinjam.jumlah;
                saveBarangList(barangList);
            }
        }

        peminjamanList = peminjamanList.filter(p => p.id !== id);
        savePeminjamanList(peminjamanList);
        renderPeminjamanTable();
        showToast('Peminjaman berhasil dihapus.');
    });
}

// ===== INISIALISASI =====

function init() {
    seedData();
    renderDashboard();
}

init();
