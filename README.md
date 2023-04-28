html-docx-js
============
_**This is a modified version by Jacob Friesen to correct an import and global fetch error.**_

This is a very small library that is capable of converting HTML documents to DOCX format that
is used by Microsoft Word 2007 and onward. It allows embedding content in a different markup
language. We are using MHT document to ship the embedded content to Word as it allows to handle images.
After Word opens such file, it converts the external content to Word Processing ML (this
is how the markup language of DOCX files is called) and replaces the reference.

Compatibility
-------------

This library works in Node.js using `Buffer`.

Images Support
-------------

This library supports only inlined base64 images (sourced via DATA URI). But it is easy to convert a
regular image (sourced from static folder) on the fly. If you need an example of such conversion you can [checkout a demo page source](https://github.com/evidenceprime/html-docx-js/blob/master/test/sample.html) (see function `convertImagesToBase64`).

Usage and demo
--------------

You can find a sample for using it in Node.js environment
[here](https://github.com/evidenceprime/html-docx-js-node-sample).

To generate DOCX, simply pass a HTML document (as string) to `asBuffer` method to receive `Buffer`
containing the output file.

    var converted = htmlDocx.asBlob(content);
    saveAs(converted, 'test.docx');

`asBlob` can take additional options for controlling page setup for the document:

* `orientation`: `landscape` or `portrait` (default)
* `margins`: map of margin sizes (expressed in twentieths of point, see
  [WordprocessingML documentation](http://officeopenxml.com/WPsectionPgMar.php) for details):
    - `top`: number (default: 1440, i.e. 2.54 cm)
    - `right`: number (default: 1440)
    - `bottom`: number (default: 1440)
    - `left`: number (default: 1440)
    - `header`: number (default: 720)
    - `footer`: number (default: 720)
    - `gutter`: number (default: 0)

For example:

    var converted = htmlDocx.asBlob(content, {orientation: 'landscape', margins: {top: 720}});
    saveAs(converted, 'test.docx');

**IMPORTANT**: please pass a complete, valid HTML (including DOCTYPE, `html` and `body` tags).
This may be less convenient, but gives you possibility of including CSS rules in `style` tags.

License
-------

Copyright (c) 2015 Evidence Prime, Inc.
See the LICENSE file for license rights and limitations (MIT).
