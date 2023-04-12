'use strict';
const getMhtDocumentTemplate = require('./templates/mht_document');
const getMhtPartTemplate = require('./templates/mht_part');

module.exports = {
    getMHTDocument,
};

/**
 * Prepare html source, populate MHT document template and return it.
 *
 * @param {String} htmlSource HTML document.
 *
 * @return {String} Populated MHT document by prepared htmlSource and content parts.
 *
 * @throws {Error} if the htmlSource is not a string.
 */
function getMHTDocument(htmlSource) {
    const mhtDocTemplateArgs = prepareContentPartsAndChangeHtmlImageSrc(htmlSource);
    return getMhtDocumentTemplate(mhtDocTemplateArgs);
}

/**
 * Look for img tag with src="data: contentType ; contentEncoding, encodedContent", then replace content location and
 * populate MHT part template by found encodedContent. Replace all "=" symbols by "=3D" in htmlSource, return prepared
 * htmlSource and populated MHT parts as a string.
 *
 * @param {String} htmlSource HTML document.
 *
 * @return {{htmlSource: String, contentParts: String}} Populated MHT document by prepared htmlSource and content parts.
 *
 * @throws {Error} if the htmlSource is not a string.
 *
 * @private
 */
function prepareContentPartsAndChangeHtmlImageSrc(htmlSource) {
    if (typeof htmlSource === 'string') {
        const imageContentParts = [];

        if (/<img/g.test(htmlSource)) {
            const inlinedSrcPattern = /"data:(\w+\/\w+);(\w+),(\S+)"/g;
            htmlSource = htmlSource.replace(inlinedSrcPattern, inlinedReplacer.bind(null, imageContentParts));
        }

        const contentParts = imageContentParts.join('\n');
        htmlSource = htmlSource.replace(/\=/g, '=3D');

        return { htmlSource, contentParts };
    } else {
        throw new Error("Not a valid source provided!");
    }
}

function inlinedReplacer(imageContentParts, match, contentType, contentEncoding, encodedContent) {
    const index = imageContentParts.length;
    const extension = contentType.split('/')[1];
    const contentLocation = `file:///C:/fake/image${index}.${extension}`;
    const mhtPartTemplate = getMhtPartTemplate({ contentType, contentEncoding, contentLocation, encodedContent });
    imageContentParts.push(mhtPartTemplate);
    return `"${contentLocation}"`;
}