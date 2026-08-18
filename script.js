document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements CRUD (Tanpa Input Email)
    const crudForm = document.getElementById('crudForm');
    const dataIdInput = document.getElementById('dataId');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    const projectsGrid = document.getElementById('projects-grid');
    const dataTable = document.getElementById('dataTable');

    // Kunci LocalStorage yang konsisten
    const STORAGE_KEY = 'my_portfolio_projects_v2';
    let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        { id: 1, title: 'Frontend Website Dishub DKI Jakarta', desc: 'Merancang dan membangun tampilan frontend website Dishub DKI Jakarta guna menyajikan informasi program serta layanan publik secara terstruktur dan responsif.' },
        { id: 2, title: 'IT Technical Support', desc: 'Melakukan perawatan, pemeliharaan, serta penanganan masalah (troubleshooting) pada perangkat lunak, keras, dan jaringan kantor.' },
        { id: 3, title: 'IT Asset Management', desc: 'Mengelola, memantau, dan mencatat seluruh siklus aset IT perusahaan mulai dari pengadaan, inventarisasi, perawatan, hingga pendataan aset.' }
    ];

    // 1. READ (Render Kartu & Tabel)
    function renderApp() {
        projectsGrid.innerHTML = '';
        dataTable.innerHTML = '';

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p style="color:#a8a29e;">Belum ada data ditambahkan.</p>';
            dataTable.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada data.</td></tr>';
            return;
        }

        projects.forEach((item, index) => {
            // Render Kartu Proyek/Data
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.transitionDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            `;
            projectsGrid.appendChild(card);

            // Render Tabel CRUD
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${item.title}</strong></td>
                <td>${item.desc}</td>
                <td>
                    <button class="btn-edit" onclick="editProject(${item.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProject(${item.id})">Delete</button>
                </td>
            `;
            dataTable.appendChild(row);
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        observeProjects();
    }

    // 2. CREATE & 3. UPDATE (Hanya memproses Title & Description)
    crudForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = dataIdInput.value;
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (id) {
            // Mode UPDATE
            const isConfirm = confirm('Apakah Anda yakin ingin mengedit data ini?\n\n[Klik OK untuk "Ya" / Klik Cancel untuk "Tidak"]');
            if (isConfirm) {
                projects = projects.map(item => item.id == id ? { id: Number(id), title, desc } : item);
                showToast('Data berhasil diperbarui!');
                resetForm();
                renderApp();
            }
        } else {
            // Mode CREATE
            const isConfirm = confirm('Apakah Anda yakin ingin menambah data ini?\n\n[Klik OK untuk "Ya" / Klik Cancel untuk "Tidak"]');
            if (isConfirm) {
                const newItem = { id: Date.now(), title, desc };
                projects.push(newItem);
                showToast('Data berhasil ditambahkan!');
                resetForm();
                renderApp();
            }
        }
    });

    // EDIT
    window.editProject = function(id) {
        const itemToEdit = projects.find(item => item.id === id);
        if (itemToEdit) {
            dataIdInput.value = itemToEdit.id;
            titleInput.value = itemToEdit.title;
            descInput.value = itemToEdit.desc;

            submitBtn.textContent = 'Simpan Perubahan';
            cancelBtn.style.display = 'inline-block';
            
            document.getElementById('crud-section').scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 4. DELETE
    window.deleteProject = function(id) {
        const isConfirm = confirm('Apakah Anda yakin ingin menghapus data ini?\n\n[Klik OK untuk "Ya" / Klik Cancel untuk "Tidak"]');
        if (isConfirm) {
            projects = projects.filter(item => item.id !== id);
            renderApp();
            showToast('Data berhasil dihapus!');
        }
    };

    cancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        dataIdInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        submitBtn.textContent = 'Add Data';
        cancelBtn.style.display = 'none';
    }

    renderApp();
    initFooterObserver();
    initNavAnimationReset();
});

/* FUNGSI ANIMASI RE-TRIGGER SAAT MENU NAVIGASI DIKLIK */
function resetAnimations() {
    const cards = document.querySelectorAll('.project-card');
    const footer = document.querySelector('footer#contact');

    cards.forEach(card => card.classList.remove('slide-in-up'));
    if (footer) footer.classList.remove('slide-in-up');

    setTimeout(() => {
        observeProjects();
        initFooterObserver();
    }, 100);
}

function initNavAnimationReset() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            resetAnimations();
        });
    });
}

// ANIMASI OBSERVER PROYEK UTAMA
function observeProjects() {
    const cards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-up');
            } else {
                entry.target.classList.remove('slide-in-up');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}

// ANIMASI OBSERVER FOOTER
function initFooterObserver() {
    const footer = document.querySelector('footer#contact');
    if (footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('slide-in-up');
                } else {
                    footer.classList.remove('slide-in-up');
                }
            });
        }, { threshold: 0.15 });

        observer.observe(footer);
    }
}

// LOGIKA NOTIFIKASI TOAST
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// FUNGSI EMAIL

function copyEmail() {
    const emailText = "moch.adya.nalendra@gmail.com";
    navigator.clipboard.writeText(emailText).then(() => {
        showToast("Email berhasil disalin!");
    }).catch(() => {
        showToast("Gagal menyalin email.");
    });
}

// LOGIKA POP-UP MODAL (ABOUT ME)
function openModal() {
    const modal = document.getElementById('aboutModal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('aboutModal');
    modal.style.display = 'none';
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('aboutModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// LOGIKA MANUAL SLIDER KEAHLIAN TEKNIS RESPONSIF
let currentSlideIndex = 0;

function moveSlide(direction) {
    const track = document.getElementById('sliderTrack');
    const cards = track.querySelectorAll('.skill-card');
    const totalCards = cards.length;
    
    const cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = totalCards - cardsPerView;

    currentSlideIndex += direction;

    if (currentSlideIndex > maxIndex) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = maxIndex;
    }

    const cardWidthPercent = 100 / cardsPerView;
    track.style.transform = `translateX(-${currentSlideIndex * cardWidthPercent}%)`;
}

// TAMBAHKAN SURAT SCRIPT.JS
function openPortfolio() {
    const envelopeLanding = document.getElementById('envelope-landing');
    if (envelopeLanding) {
        envelopeLanding.classList.add('opened');
        setTimeout(() => {
            if (typeof resetAnimations === 'function') {
                resetAnimations();
            }
        }, 300);
    }
}

// FUNGSI KELUAR DARI PORTOFOLIO / KEMBALI KE COVER SURAT
function closePortfolio() {
    const envelopeLanding = document.getElementById('envelope-landing');
    if (envelopeLanding) {
        envelopeLanding.classList.remove('opened');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}