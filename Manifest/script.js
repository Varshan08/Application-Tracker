// --- 1. STATE MANAGEMENT ---
let currentCategory = 'Personal';

let visions = {
    Personal: [],
    Friends: [],
    Family: [],
    Couple: []
};

function applyTheme(category) {
    document.body.classList.remove(
        "personal-theme",
        "family-theme",
        "couple-theme",
        "friends-theme"
    );

    if (category === "Personal") document.body.classList.add("personal-theme");
    if (category === "Family") document.body.classList.add("family-theme");
    if (category === "Couple") document.body.classList.add("couple-theme");
    if (category === "Friends") document.body.classList.add("friends-theme");
}

// Load Credentials
let userCredentials = JSON.parse(localStorage.getItem('unityCredentials')) || {
    username: 'Dreamer',
    accessCode: '1234'
};

// --- 2. STORAGE FUNCTIONS ---
function loadVisions() {
    const saved = localStorage.getItem('unityVisionBoards');
    if (saved) visions = JSON.parse(saved);
}

function saveVisions() {
    localStorage.setItem('unityVisionBoards', JSON.stringify(visions));
}

// --- 3. LOGIN ---
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const inputCode = document.getElementById('accessCode').value;

    if (inputCode === userCredentials.accessCode) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('appContainer').classList.add('active');

        loadVisions();
        applyTheme(currentCategory);
        startThemeEffects(currentCategory);
        renderVisions();
    } else {
        alert('Incorrect Access Code!');
    }
});

// --- LOGOUT ---
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm("Ready to log out? Your visions remain safe.")) {
        location.reload();
    }
});


// --- 5. SETTINGS ---
const settingsOverlay = document.getElementById('settingsOverlay');

document.getElementById('settingsBtn').addEventListener('click', () => {
    settingsOverlay.classList.add('active');
    document.getElementById('newUsername').value = userCredentials.username;
    document.getElementById('newAccessCode').value = userCredentials.accessCode;
});

document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    settingsOverlay.classList.remove('active');
});

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    const newName = document.getElementById('newUsername').value.trim();
    const newCode = document.getElementById('newAccessCode').value.trim();

    if (newName && newCode) {
        userCredentials = { username: newName, accessCode: newCode };
        localStorage.setItem('unityCredentials', JSON.stringify(userCredentials));
        alert('Settings Saved!');
        settingsOverlay.classList.remove('active');
    }
});

// --- 6. CATEGORY NAV ---
document.getElementById('categoryNav').addEventListener('click', (e) => {
    const button = e.target.closest('.nav-button');
    if (!button || ['settingsBtn', 'darkModeBtn', 'logoutBtn'].includes(button.id)) return;

    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    currentCategory = button.dataset.category;

    applyTheme(currentCategory);
    startThemeEffects(currentCategory);

    updateCategoryHeader();
    renderVisions();
});

// --- 7. VISION LOGIC ---
function updateCategoryHeader() {
    const total = visions[currentCategory].length;
    const manifested = visions[currentCategory].filter(v => v.isDone).length;

    document.getElementById('categoryTitle').textContent = `${currentCategory} Vision Board`;
    document.getElementById('categorySubtitle').textContent =
        `${total} vision${total !== 1 ? 's' : ''} • ${manifested} manifested ✨`;
}

function renderVisions() {
    const grid = document.getElementById('visionGrid');
    const categoryVisions = visions[currentCategory];

    if (categoryVisions.length === 0) {
        grid.innerHTML = `<div class="empty-state"><h3>Your Canvas Awaits</h3></div>`;
        updateCategoryHeader();
        return;
    }

    grid.innerHTML = categoryVisions.map(vision => `
        <div class="card ${vision.isDone ? 'done' : ''}" data-id="${vision.id}">
            <div class="card-image" style="background-image: url('${vision.imageUrl}')"></div>
            <div class="card-content">
                <h3>${vision.title}</h3>
                <p>${vision.affirmation}</p>
            </div>
            <div class="card-actions">
                <button onclick="toggleDone(${vision.id})">
                    ${vision.isDone ? '✓ Manifested' : '✨ Mark Done'}
                </button>
                <button onclick="deleteVision(${vision.id})">×</button>
            </div>
        </div>
    `).join('');

    updateCategoryHeader();
}

function toggleDone(id) {
    visions[currentCategory] = visions[currentCategory].map(v =>
        v.id === id ? { ...v, isDone: !v.isDone } : v
    );

    saveVisions();
    renderVisions();

    const glow = document.createElement("div");
    glow.className = "manifest-glow";
    document.body.appendChild(glow);
    setTimeout(() => glow.remove(), 1000);
}

function deleteVision(id) {
    if (confirm('Delete this vision?')) {
        visions[currentCategory] = visions[currentCategory].filter(v => v.id !== id);
        saveVisions();
        renderVisions();
    }
}

// --- MODAL ---
const goalName = document.getElementById('goalName');
const imageUrlInput = document.getElementById('imageUrl');
const affirmationInput = document.getElementById('affirmation');

document.getElementById('addVisionBtn').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.add('active');
});

document.getElementById('closeModalBtn').onclick = closeModal;
document.getElementById('cancelBtn').onclick = closeModal;

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('submitVisionBtn').addEventListener('click', () => {
    const title = goalName.value.trim();
    const imageUrl = imageUrlInput.value.trim();
    const affirmation = affirmationInput.value.trim();

    if (title && imageUrl && affirmation) {
        visions[currentCategory].push({
            id: Date.now(),
            title,
            imageUrl,
            affirmation,
            isDone: false
        });

        saveVisions();
        renderVisions();
        closeModal();
    }
});

// --- 8. MOUSE EFFECT ---
document.addEventListener("mousemove", (e) => {

    if (Math.random() > 0.8) {
        const orb = document.createElement("div");
        orb.className = "cursor-glow";
        orb.style.left = e.clientX + "px";
        orb.style.top = e.clientY + "px";
        document.body.appendChild(orb);
        setTimeout(() => orb.remove(), 400);
    }

    document.querySelectorAll(".card").forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rx = -(y - rect.height / 2) / 25;
        const ry = (x - rect.width / 2) / 25;

        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
});

document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) {
        document.querySelectorAll(".card").forEach(card => {
            card.style.transform = "rotateX(0deg) rotateY(0deg)";
        });
    }
});

// --- 9. INIT ---
window.addEventListener("load", () => {

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    loadVisions();
    applyTheme(currentCategory);
    startThemeEffects(currentCategory);

    const intro = document.getElementById("introScreen");
    if (intro) {
        setTimeout(() => {
            intro.classList.add("fade-out");
            setTimeout(() => intro.remove(), 1000);
        }, 2000);
    }
});


// --- THEME ANIMATION ENGINE ---
function startThemeEffects(category) {

    if (window.themeInterval) {
        clearInterval(window.themeInterval);
    }

    if (category === "Couple") {
        window.themeInterval = setInterval(() => {
            const heart = document.createElement("div");
            heart.className = "heart";
            heart.innerText = "❤";
            heart.style.left = Math.random() * window.innerWidth + "px";
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }, 500);
    }

    else if (category === "Friends") {
        const emojis = ["😄","🔥","🎉","🤩","😎"];

        window.themeInterval = setInterval(() => {
            const emoji = document.createElement("div");
            emoji.className = "emoji";
            emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * window.innerWidth + "px";
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 7000);
        }, 600);
    }
}
