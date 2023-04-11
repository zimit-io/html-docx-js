module.exports = (templateArgs) => {
    const { htmlSource, contentParts } = templateArgs || {};
    return `MIME-Version: 1.0
Content-Type: multipart/related;
    type="text/html";
    boundary="----=mhtDocumentPart"\n\n
------=mhtDocumentPart
Content-Type: text/html;
    charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Location: file:///C:/fake/document.html\n
${htmlSource ?? ''}\n
${contentParts ?? ''}\n
------=mhtDocumentPart--\n`;
}