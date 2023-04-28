'use strict';
const { addFiles, generateDocument } = require('./internal');
const JSZip = require('jszip');

module.exports = {
    asBuffer,
};

/**
 * Convert HTML documents to DOCX.
 *
 * @param {String} html HTML document.
 * @param {Object} options document template options.
 *
 * @return {Promise<Buffer>}
 */
async function asBuffer(html, options) {
    const zip = new JSZip();
    await addFiles(zip, html, options);
    return generateDocument(zip);
}