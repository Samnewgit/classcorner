// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    displayAllPDFs();
    setupEventListeners();
});

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const adminPdfList = document.getElementById('adminPdfList');
const logoutBtn = document.getElementById('logoutBtn');

// Function to format date as dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Function to add a new PDF
function addPDF(class_, title, link, isPublic = true) {
    let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];
    const newPDF = {
        id: Date.now(),
        class: class_,
        title,
        link,
        isPublic,
        createdAt: new Date().toISOString()
    };
    
    pdfs.push(newPDF);
    localStorage.setItem('pdfs', JSON.stringify(pdfs));
    displayAllPDFs();
}

// Function to display all PDFs (including private ones)
function displayAllPDFs() {
    adminPdfList.innerHTML = '';
    const pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];
    
    pdfs.forEach((pdf, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${pdf.class || 'N/A'}</td>
            <td>${formatDate(pdf.createdAt)}</td>
            <td><a href="${pdf.link}" target="_blank">${pdf.title}</a></td>
            <td class="${pdf.isPublic ? 'status-public' : 'status-private'}">
                ${pdf.isPublic ? 'Public' : 'Private'}
            </td>
            <td>
                <div class="pdf-actions">
                    <button onclick="toggleVisibility(${pdf.id})" class="action-btn">
                        ${pdf.isPublic ? 'Make Private' : 'Make Public'}
                    </button>
                    <button onclick="deletePDF(${pdf.id})" class="action-btn delete">Delete</button>
                </div>
            </td>
        `;
        adminPdfList.appendChild(row);
    });
}

// Function to setup event listeners
function setupEventListeners() {
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const class_ = document.getElementById('pdfClass').value;
        const title = document.getElementById('pdfTitle').value;
        const link = document.getElementById('pdfLink').value;
        const isPublic = document.getElementById('isPublic').checked;
        
        addPDF(class_, title, link, isPublic);
        uploadForm.reset();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    });
}

// Function to toggle PDF visibility
function toggleVisibility(id) {
    let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];
    pdfs = pdfs.map(pdf => {
        if (pdf.id === id) {
            return { ...pdf, isPublic: !pdf.isPublic };
        }
        return pdf;
    });
    localStorage.setItem('pdfs', JSON.stringify(pdfs));
    displayAllPDFs();
}

// Function to delete PDF
function deletePDF(id) {
    if (confirm('Are you sure you want to delete this PDF?')) {
        let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];
        pdfs = pdfs.filter(pdf => pdf.id !== id);
        localStorage.setItem('pdfs', JSON.stringify(pdfs));
        displayAllPDFs();
    }
} 