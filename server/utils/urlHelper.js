/**
 * URL Helper Utility for Consistent URL Generation
 * Ensures all URLs work correctly in EC2 deployment
 */

const getFrontendUrl = (req) => {
    // In production, frontend runs on port 3000, backend on 5000
    if (process.env.NODE_ENV === 'production') {
        return 'http://16.170.245.52:3000';
    }
    
    // In development, replace backend port with frontend port
    const host = req.get('host');
    return `${req.protocol}://${host.replace(':5000', ':3000')}`;
};

const getBackendUrl = (req) => {
    // In production, backend runs on port 5000
    if (process.env.NODE_ENV === 'production') {
        return 'http://16.170.245.52:5000';
    }
    
    // In development, use current host
    return `${req.protocol}://${req.get('host')}`;
};

const generateFileUrl = (req, filename) => {
    const frontendUrl = getFrontendUrl(req);
    return `${frontendUrl}/uploads/${filename}`;
};

const generateMultipleFileUrls = (req, files) => {
    const frontendUrl = getFrontendUrl(req);
    return files.map(file => ({
        url: `${frontendUrl}/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype
    }));
};

module.exports = {
    getFrontendUrl,
    getBackendUrl,
    generateFileUrl,
    generateMultipleFileUrls
};
