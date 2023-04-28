const utils = require('../lib/utils');

describe('utils', () => {
    describe('getMHTDocument', () => {
        it('return MHT document with replaced img src due htmlSource contains img tag with src', () => {
            const htmlSource = '<p><img src="data:image/jpeg;base64,PHN2ZyB..."></p>';
            const expectedAnswer = `
                MIME-Version: 1.0
                Content-Type: multipart/related;
                type="text/html";
                boundary="----=mhtDocumentPart"
                ------=mhtDocumentPart
                Content-Type: text/html;
                charset="utf-8"
                Content-Transfer-Encoding: quoted-printable
                Content-Location: file:///C:/fake/document.html
                <p><img src=3D"file:///C:/fake/image0.jpeg"></p>
                ------=mhtDocumentPart
                Content-Type: image/jpeg
                Content-Transfer-Encoding: base64
                Content-Location: file:///C:/fake/image0.jpeg
                PHN2ZyB...
                ------=mhtDocumentPart--`

            const result = utils.getMHTDocument(htmlSource);

            expect(result.replace(/\s/g, "")).toEqual(expectedAnswer.replace(/\s/g, ""));
        });

        it('return MHT document due htmlSource does not contain any img tags', () => {
            const htmlSource = '<!DOCTYPE HTML><head></head><body></body>';
            const expectedAnswer = `
            MIME-Version: 1.0
            Content-Type: multipart/related;
            type="text/html";
            boundary="----=mhtDocumentPart"
            ------=mhtDocumentPart
            Content-Type: text/html;
            charset="utf-8"
            Content-Transfer-Encoding: quoted-printable
            Content-Location: file:///C:/fake/document.html
                <!DOCTYPE HTML><head></head><body></body>
            ------=mhtDocumentPart--`;

            const result = utils.getMHTDocument(htmlSource);

            expect(result.replace(/\s/g, "")).toEqual(expectedAnswer.replace(/\s/g, ""));
        });

        it('return MHT document due htmlSource does not contain any img tags', () => {
            const htmlSource = '<body style="width: 100%">This = 0</body>';
            const expectedAnswer = `
                MIME-Version: 1.0
                Content-Type: multipart/related;
                type="text/html";
                boundary="----=mhtDocumentPart"
                ------=mhtDocumentPart
                Content-Type: text/html;
                charset="utf-8"
                Content-Transfer-Encoding: quoted-printable
                Content-Location: file:///C:/fake/document.html
                <body style=3D"width: 100%">This =3D 0</body>
                ------=mhtDocumentPart--
            `;

            const result = utils.getMHTDocument(htmlSource);

            expect(result.replace(/\s/g, "")).toEqual(expectedAnswer.replace(/\s/g, ""));
        });

        it('return MHT document with multiple replaced img src due htmlSource contains some img tags with src', () => {
            const htmlSource = `<p><img src="data:image/jpeg;base64,PHN2ZyB...">
                <img src="data:image/png;base64,PHN3ZyB...">
                <img src="data:image/gif;base64,PHN4ZyB..."></p>`;

            const expectedAnswer = `
                MIME-Version: 1.0
                Content-Type: multipart/related;
                type="text/html";
                boundary="----=mhtDocumentPart"
                ------=mhtDocumentPart
                Content-Type: text/html;
                charset="utf-8"
                Content-Transfer-Encoding: quoted-printable
                Content-Location: file:///C:/fake/document.html
                <p><img src=3D"file:///C:/fake/image0.jpeg"> <img src=3D"file:///C:/fake/image1.png"> <img src=3D"file:///C:/fake/image2.gif"></p>
                ------=mhtDocumentPart
                Content-Type: image/jpeg
                Content-Transfer-Encoding: base64
                Content-Location: file:///C:/fake/image0.jpeg
                PHN2ZyB...
                ------=mhtDocumentPart
                Content-Type: image/png
                Content-Transfer-Encoding: base64
                Content-Location: file:///C:/fake/image1.png
                PHN3ZyB...
                ------=mhtDocumentPart
                Content-Type: image/gif
                Content-Transfer-Encoding: base64
                Content-Location: file:///C:/fake/image2.gif
                PHN4ZyB...
                ------=mhtDocumentPart--`;

            const result = utils.getMHTDocument(htmlSource);

            expect(result.replace(/\s/g, "")).toEqual(expectedAnswer.replace(/\s/g, ""));
        });

        it('throw error due htmlSource is not a string', () => {
            const htmlSource = null;

            try {
                utils.getMHTDocument(htmlSource);
            } catch (e) {
                expect(e.message).toEqual('Not a valid source provided!')
            }
        });
    });
});