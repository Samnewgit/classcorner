// Authentication state
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeBtn = document.querySelector('.close');

// Secret key combination: Ctrl + Alt + A
let keySequence = [];
const secretSequence = ['Control', 'Alt', 'a'];
let lastKeyTime = 0;

// Initialize UI based on authentication
function updateUIState() {
    if (loginBtn) {
        loginBtn.textContent = isAuthenticated ? 'Logout' : 'Login';
    }
}

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
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (!isAuthenticated) {
            loginModal.style.display = 'block';
        } else {
            // Handle logout
            isAuthenticated = false;
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            updateUIState();
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            window.location.href = basePath + 'index.html';
        }
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}

if (loginModal) {
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const otp = document.getElementById('otp').value;

        if (username === 'Camus' && otp === '12may') {
            isAuthenticated = true;
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', username);
            loginModal.style.display = 'none';
            updateUIState();
            
            // Use absolute path for dashboard
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            window.location.href = basePath + 'dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const currentPath = window.location.pathname;
    
    if (authStatus === 'true') {
        isAuthenticated = true;
        updateUIState();
        
        if (currentPath.includes('dashboard.html')) {
            // Already on dashboard, do nothing
            return;
        } else if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
            // Redirect to dashboard if on main page
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            window.location.href = basePath + 'dashboard.html';
        }
    } else if (currentPath.includes('dashboard.html')) {
        // Not authenticated and trying to access dashboard
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        window.location.href = basePath + 'index.html';
    }
}); 
