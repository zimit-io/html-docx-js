'use strict';
const { addFiles, generateDocument } = require('./internal');
const JSZip = require('jszip');

module.exports = {
    asBuffer,
};

async function asBuffer(html, options) {
    const zip = new JSZip();
    await addFiles(zip, html, options);
    return generateDocument(zip);
}