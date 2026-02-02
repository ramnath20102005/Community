/**
 * Utility to convert a File object to a Base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - The Base64 encoded string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Utility to convert multiple files to Base64 strings
 * @param {FileList|Array} files - List of files to convert
 * @returns {Promise<Array<string>>} - Array of Base64 encoded strings
 */
export const filesToBase64 = async (files) => {
    const promises = Array.from(files).map(file => fileToBase64(file));
    return Promise.all(promises);
};
