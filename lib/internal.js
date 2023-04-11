'use strict';
const { readFile } = require('fs/promises');
const { getMHTDocument } = require('./utils');
const getDocumentTemplate = require('./templates/document');

module.exports = {
    generateDocument,
    addFiles,
};

async function generateDocument(zip) {
    const buffer = await zip.generateAsync({ type: 'arraybuffer' });
    const array = new Uint8Array(buffer);
    return Buffer.from(array);
}

async function addFiles(zip, htmlSource, documentOptions) {
    const [contentTypes, rels, document] = await Promise.all([
        readFile(__dirname + '/assets/content_types.xml'),
        readFile(__dirname + '/assets/rels.xml'),
        readFile(__dirname + '/assets/document.xml.rels'),
    ]);

    zip.file('[Content_Types].xml', contentTypes);

    zip.folder('_rels')
        .file('.rels', rels);

    zip.folder('word')
        .file('document.xml', renderDocumentFile(documentOptions))
        .file('afchunk.mht', getMHTDocument(htmlSource))
        .folder('_rels')
        .file('document.xml.rels', document);
}

function renderDocumentFile(documentOptions) {
    const templateData = {
        margins: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
            header: 720,
            footer: 720,
            gutter: 0,
            ...documentOptions.margins,
        },
    };

    if (documentOptions.orientation === 'landscape') {
        templateData.height = 12240;
        templateData.width = 15840;
        templateData.orient = 'landscape';
    } else {
        templateData.height = 15840;
        templateData.width = 12240;
        templateData.orient = 'portrait';
    }

    return getDocumentTemplate(templateData);
}