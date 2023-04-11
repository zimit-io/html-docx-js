const JSZip = require("jszip");
const internal = require('../lib/internal');

describe('internal', () => {
    describe('addFiles', () => {
        const zip = new JSZip();
        let documentOptions;

        const expectedContentTypes = `
                <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
                    <Default Extension="rels" ContentType=
                        "application/vnd.openxmlformats-package.relationships+xml" />
                    <Override PartName="/word/document.xml" ContentType=
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
                    <Override PartName="/word/afchunk.mht" ContentType="message/rfc822"/>
                </Types>`;
        const expectedRels = `
                <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
                    <Relationship
                        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
                        Target="/word/document.xml" Id="R09c83fafc067488e" />
                </Relationships>`;
        const expectedDocument = `
                <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
                    <Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk"
                        Target="/word/afchunk.mht" Id="htmlChunk" />
                </Relationships>`;

        beforeEach(() => {
            JSZip.prototype.folder = jasmine.createSpy().and.returnValue(JSZip.prototype);
            JSZip.prototype.file = jasmine.createSpy().and.returnValue(JSZip.prototype);
            documentOptions = {
                margins: {},
                orientation: 'landscape',
            };
        });

        it('create folders and files, populate document.xml by document template with landscape', async () => {
            const htmlSource = '<!DOCTYPE HTML><head></head><body></body>';
            const expectedRenderedFile = `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <w:document
                xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
                xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
                xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:ns6="http://schemas.openxmlformats.org/schemaLibrary/2006/main"
                xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"
                xmlns:ns8="http://schemas.openxmlformats.org/drawingml/2006/chartDrawing"
                xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
                xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                xmlns:ns11="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
                xmlns:dsp="http://schemas.microsoft.com/office/drawing/2008/diagram"
                xmlns:ns13="urn:schemas-microsoft-com:office:excel"
                xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:w10="urn:schemas-microsoft-com:office:word"
                xmlns:ns17="urn:schemas-microsoft-com:office:powerpoint"
                xmlns:odx="http://opendope.org/xpaths"
                xmlns:odc="http://opendope.org/conditions"
                xmlns:odq="http://opendope.org/questions"
                xmlns:odi="http://opendope.org/components"
                xmlns:odgm="http://opendope.org/SmartArt/DataHierarchy"
                xmlns:ns24="http://schemas.openxmlformats.org/officeDocument/2006/bibliography"
                xmlns:ns25="http://schemas.openxmlformats.org/drawingml/2006/compatibility"
                xmlns:ns26="http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas">
                <w:body>
                    <w:altChunk r:id="htmlChunk" />
                    <w:sectPr>
                        <w:pgSz w:w="15840" w:h="12240" w:orient="landscape" />
                        <w:pgMar w:top="1440"
                            w:right="1440"
                            w:bottom="1440"
                            w:left="1440"
                            w:header="720"
                            w:footer="720"
                            w:gutter="0"/>
                    </w:sectPr>
                </w:body>
            </w:document>`;
            const fileCalls = JSZip.prototype.file.calls.all();

            await internal.addFiles(zip, htmlSource, documentOptions);

            expect(Buffer.from(fileCalls[0].args[1]).toString().replace(/\s/g, ""))
                .toEqual(expectedContentTypes.replace(/\s/g, ""));
            expect(Buffer.from(fileCalls[1].args[1]).toString().replace(/\s/g, ""))
                .toEqual(expectedRels.replace(/\s/g, ""));
            expect(Buffer.from(fileCalls[4].args[1]).toString().replace(/\s/g, ""))
                .toEqual(expectedDocument.replace(/\s/g, ""));
            expect(fileCalls[2].args[1].replace(/\s/g, ""))
                .toEqual(expectedRenderedFile.replace(/\s/g, ""));
            expect(JSZip.prototype.folder).toHaveBeenCalledTimes(3);
            expect(JSZip.prototype.file).toHaveBeenCalledTimes(5);
        });

        it('create folders and files, populate document.xml by document template with portrait', async () => {
            documentOptions = {
                orientation: 'portrait',
                margins: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    header: 0,
                    footer: 0,
                    gutter: 10,
                },
            };
            const htmlSource = '<!DOCTYPE HTML><head></head><body></body>';
            const expectedRenderedFile = `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <w:document
                xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
                xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
                xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:ns6="http://schemas.openxmlformats.org/schemaLibrary/2006/main"
                xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"
                xmlns:ns8="http://schemas.openxmlformats.org/drawingml/2006/chartDrawing"
                xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
                xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
                xmlns:ns11="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
                xmlns:dsp="http://schemas.microsoft.com/office/drawing/2008/diagram"
                xmlns:ns13="urn:schemas-microsoft-com:office:excel"
                xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:w10="urn:schemas-microsoft-com:office:word"
                xmlns:ns17="urn:schemas-microsoft-com:office:powerpoint"
                xmlns:odx="http://opendope.org/xpaths"
                xmlns:odc="http://opendope.org/conditions"
                xmlns:odq="http://opendope.org/questions"
                xmlns:odi="http://opendope.org/components"
                xmlns:odgm="http://opendope.org/SmartArt/DataHierarchy"
                xmlns:ns24="http://schemas.openxmlformats.org/officeDocument/2006/bibliography"
                xmlns:ns25="http://schemas.openxmlformats.org/drawingml/2006/compatibility"
                xmlns:ns26="http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas">
                <w:body>
                    <w:altChunk r:id="htmlChunk" />
                    <w:sectPr>
                        <w:pgSz w:w="12240" w:h="15840" w:orient="portrait" />
                        <w:pgMar w:top="0"
                            w:right="0"
                            w:bottom="0"
                            w:left="0"
                            w:header="0"
                            w:footer="0"
                            w:gutter="10"/>
                    </w:sectPr>
                </w:body>
            </w:document>`;
            const fileCalls = JSZip.prototype.file.calls.all();

            await internal.addFiles(zip, htmlSource, documentOptions);

            expect(Buffer.from(fileCalls[0].args[1]).toString().replace(/\s/g, ""))
                .toEqual(expectedContentTypes.replace(/\s/g, ""));
            expect(Buffer.from(fileCalls[1].args[1]).toString().replace(/\s/g, ""))
                .toEqual(expectedRels.replace(/\s/g, ""));
            expect(Buffer.from(fileCalls[4].args[1]).toString().replace(/\s/g, ""))
                .toEqual(expectedDocument.replace(/\s/g, ""));
            expect(JSZip.prototype.file.calls.all()[2].args[1].replace(/\s/g, ""))
                .toEqual(expectedRenderedFile.replace(/\s/g, ""));
            expect(JSZip.prototype.folder).toHaveBeenCalledTimes(3);
            expect(JSZip.prototype.file).toHaveBeenCalledTimes(5);
        });
    });

    describe('generateDocument', () => {
        const zip = new JSZip();

        it('return buffer of zip file', async () => {
            if (!global.Buffer) return;

            const result = await internal.generateDocument(zip);

            expect(result instanceof Buffer).toBeTrue();
        });
    });
});