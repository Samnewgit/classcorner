// API endpoint
const API_URL = 'https://your-worker.your-subdomain.workers.dev/api/pdfs';

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    // Show welcome toast
    showToast();

    // Initialize dashboard
    displayAllPDFs();
    setupEventListeners();
});

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const adminPdfList = document.getElementById('adminPdfList');
const toast = document.getElementById('loginSuccessToast');

// Function to format date as dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Function to show welcome toast
function showToast() {
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Function to fetch all PDFs
async function fetchPDFs() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch PDFs');
        return await response.json();
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        return [];
    }
}

// Function to save PDFs
async function savePDFs(pdfs) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pdfs)
        });
        if (!response.ok) throw new Error('Failed to save PDFs');
        return true;
    } catch (error) {
        console.error('Error saving PDFs:', error);
        return false;
    }
}

// Function to add a new PDF
async function addPDF(class_, title, link, isPublic = true) {
    const pdfs = await fetchPDFs();
    const newPDF = {
        id: Date.now(),
        class: class_,
        title,
        link,
        isPublic,
        createdAt: new Date().toISOString()
    };
    
    pdfs.push(newPDF);
    await savePDFs(pdfs);
    displayAllPDFs();
}

// Function to display all PDFs
async function displayAllPDFs() {
    adminPdfList.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    const pdfs = await fetchPDFs();
    
    adminPdfList.innerHTML = '';
    pdfs.forEach((pdf, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="${pdf.link}" target="_blank">${pdf.title}</a></td>
            <td>${pdf.class || 'N/A'}</td>
            <td>${formatDate(pdf.createdAt)}</td>
            <td>
                <label class="switch-label">
                    <input type="checkbox" ${pdf.isPublic ? 'checked' : ''} onchange="toggleVisibility(${pdf.id})">
                    <span class="switch-slider"></span>
                </label>
            </td>
            <td>
                <div class="action-btn-group">
                    <button onclick="window.open('${pdf.link}', '_blank')" class="action-btn view-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button onclick="deletePDF(${pdf.id})" class="action-btn delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        adminPdfList.appendChild(row);
    });
}

// Function to setup event listeners
function setupEventListeners() {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const class_ = document.getElementById('pdfClass').value;
        const title = document.getElementById('pdfTitle').value;
        const link = document.getElementById('pdfLink').value;
        const isPublic = document.getElementById('isPublic').checked;
        
        await addPDF(class_, title, link, isPublic);
        uploadForm.reset();
    });
}

// Function to toggle PDF visibility
async function toggleVisibility(id) {
    const pdfs = await fetchPDFs();
    const updatedPdfs = pdfs.map(pdf => {
        if (pdf.id === id) {
            return { ...pdf, isPublic: !pdf.isPublic };
        }
        return pdf;
    });
    await savePDFs(updatedPdfs);
    displayAllPDFs();
}

// Function to delete PDF
async function deletePDF(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        const pdfs = await fetchPDFs();
        const updatedPdfs = pdfs.filter(pdf => pdf.id !== id);
        await savePDFs(updatedPdfs);
        displayAllPDFs();
    }
} 
