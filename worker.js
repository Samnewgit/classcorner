// Define allowed origins for CORS
const ALLOWED_ORIGINS = ['https://classcorner.pages.dev'];

// Handle CORS preflight requests
function handleOptions(request) {
    const origin = request.headers.get('Origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
        return new Response(null, { status: 403 });
    }

    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}

// Handle the request
async function handleRequest(request) {
    const origin = request.headers.get('Origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
        return new Response('Forbidden', { status: 403 });
    }

    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
    };

    try {
        const url = new URL(request.url);
        const path = url.pathname;

        // Get all PDFs
        if (path === '/api/pdfs' && request.method === 'GET') {
            const pdfs = await PDF_STORAGE.get('pdfs');
            return new Response(pdfs || '[]', { headers: corsHeaders });
        }

        // Add or update PDFs
        if (path === '/api/pdfs' && request.method === 'POST') {
            const data = await request.json();
            await PDF_STORAGE.put('pdfs', JSON.stringify(data));
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        return new Response('Not Found', { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: corsHeaders,
        });
    }
}

// Main event listener
addEventListener('fetch', event => {
    const request = event.request;
    
    if (request.method === 'OPTIONS') {
        event.respondWith(handleOptions(request));
    } else {
        event.respondWith(handleRequest(request));
    }
}); 