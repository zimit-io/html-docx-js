const JSZip = require('jszip');
const api = require('../lib/api');

describe('api', () => {
    describe('asBuffer', () => {
        let options;

        beforeEach(() => {
            JSZip.prototype.folder = jasmine.createSpy().and.returnValue(JSZip.prototype);
            JSZip.prototype.file = jasmine.createSpy().and.returnValue(JSZip.prototype);

            options = {
                margins: {},
                orientation: 'landscape',
            };
        });

        it('throw error due htmlSource is not a string', async () => {
            try {
                await api.asBuffer(undefined, options);
            } catch (e) {
                expect(e.message).toEqual('Not a valid source provided!');
                expect(JSZip.prototype.folder).toHaveBeenCalledTimes(2);
                expect(JSZip.prototype.file).toHaveBeenCalledTimes(3);
            }
        });

        it('create folders and files, populate them by templates and return buffer of zip',async () => {
            if (!global.Buffer) return;
            const htmlSource = '<p><img src="data:image/jpeg;base64,PHN2ZyB..."></p>';

            const result = await api.asBuffer(htmlSource, options);

            expect(result instanceof Buffer).toBeTrue();
            expect(JSZip.prototype.folder).toHaveBeenCalledTimes(3);
            expect(JSZip.prototype.file).toHaveBeenCalledTimes(5);
        });
    });
});