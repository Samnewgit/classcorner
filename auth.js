// Authentication state
let isAuthenticated = false;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeBtn = document.querySelector('.close');

// Secret key combination: Ctrl + Alt + A
let keySequence = [];
const secretSequence = ['Control', 'Alt', 'a'];
let lastKeyTime = 0;

// Handle key combinations
document.addEventListener('keydown', (e) => {
    const currentTime = new Date().getTime();
    
    // Reset sequence if too much time has passed
    if (currentTime - lastKeyTime > 1000) {
        keySequence = [];
    }
    
    lastKeyTime = currentTime;
    keySequence.push(e.key);
    
    // Keep only the last 3 keys
    if (keySequence.length > 3) {
        keySequence.shift();
    }
    
    // Check if the sequence matches
    if (keySequence.join(',') === secretSequence.join(',')) {
        loginModal.style.display = 'block';
        keySequence = []; // Reset sequence
    }
});

// Also allow accessing via URL hash
window.addEventListener('hashchange', checkHash);
window.addEventListener('load', checkHash);

function checkHash() {
    // Accept both hash formats: #admin-2024 and #2024-admin
    if (window.location.hash === '#admin-2024' || window.location.hash === '#2024-admin') {
        loginModal.style.display = 'block';
        window.location.hash = ''; // Clear hash
    }
}

// Event Listeners
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const otp = document.getElementById('otp').value;

    if (username === 'Camus' && otp === '12may') {
        isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        loginModal.style.display = 'none';
        loginBtn.textContent = 'Logout';
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials');
    }
});

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
        isAuthenticated = true;
        loginBtn.textContent = 'Logout';
        if (window.location.pathname.includes('dashboard.html')) {
            // Already on dashboard
            return;
        } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            // Redirect to dashboard if on main page
            window.location.href = 'dashboard.html';
        }
    } else if (window.location.pathname.includes('dashboard.html')) {
        // Not authenticated and trying to access dashboard
        window.location.href = 'index.html';
    }

    // Handle logout
    loginBtn.addEventListener('click', () => {
        if (isAuthenticated) {
            isAuthenticated = false;
            localStorage.removeItem('isAuthenticated');
            loginBtn.textContent = 'Login';
            window.location.href = 'index.html';
        }
    });
}); 
