module.exports = (templateArgs) => {
    const { contentType, contentEncoding, contentLocation, encodedContent } = templateArgs || {};
    return `------=mhtDocumentPart
Content-Type: ${contentType ?? ''}
Content-Transfer-Encoding: ${contentEncoding ?? ''}
Content-Location: ${contentLocation ?? ''}\n
${encodedContent ?? ''}\n`;
}