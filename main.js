// PDF data structure
let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];

// DOM Elements
const pdfList = document.getElementById('pdfList');

// Function to format date as dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Function to display PDFs
function displayPDFs() {
    pdfList.innerHTML = '';
    const publicPDFs = pdfs.filter(pdf => pdf.isPublic);
    
    publicPDFs.forEach((pdf, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="column-small">${index + 1}</td>
            <td class="column-small">${pdf.class || 'N/A'}</td>
            <td class="column-large"><a href="${pdf.link}" target="_blank">${pdf.title}</a></td>
            <td class="column-medium">${formatDate(pdf.createdAt)}</td>
        `;
        pdfList.appendChild(row);
    });
}

// Function to add a new PDF
function addPDF(class_, title, link, isPublic = true) {
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
    displayPDFs();
}

// Function to delete a PDF
function deletePDF(id) {
    pdfs = pdfs.filter(pdf => pdf.id !== id);
    localStorage.setItem('pdfs', JSON.stringify(pdfs));
    displayPDFs();
}

// Function to toggle PDF visibility
function togglePDFVisibility(id) {
    pdfs = pdfs.map(pdf => {
        if (pdf.id === id) {
            return { ...pdf, isPublic: !pdf.isPublic };
        }
        return pdf;
    });
    localStorage.setItem('pdfs', JSON.stringify(pdfs));
    displayPDFs();
}

// Initialize display
document.addEventListener('DOMContentLoaded', () => {
    displayPDFs();
}); 