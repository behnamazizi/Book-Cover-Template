document.addEventListener('DOMContentLoaded', () => {


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', {
                scope: '/Book-Cover-Template/'
            })
            .then(function (reg) {
                if (reg.installing) {
                    console.log('Service worker installing');
                } else if (reg.waiting) {
                    console.log('Service worker installed');
                } else if (reg.active) {
                    console.log('Service worker active');
                }
            })
            .catch(function (error) {
                console.log('Registration failed with ' + error);
            });
    }
    window.resizeTo(965, 765);
    draw()

})

const elm = document.querySelector("#bookCoverTemplate");
const Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (input) {
        var output = "",
            chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        for (input = Base64._utf8_encode(input); i < input.length;) enc1 = (chr1 = input.charCodeAt(i++)) >> 2, enc2 = (3 & chr1) << 4 | (chr2 = input.charCodeAt(i++)) >> 4, enc3 = (15 & chr2) << 2 | (chr3 = input.charCodeAt(i++)) >> 6, enc4 = 63 & chr3, isNaN(chr2) ? enc3 = enc4 = 64 : isNaN(chr3) && (enc4 = 64), output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        return output
    },
    decode: function (input) {
        var output = "",
            chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        for (input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); i < input.length;) chr1 = (enc1 = this._keyStr.indexOf(input.charAt(i++))) << 2 | (enc2 = this._keyStr.indexOf(input.charAt(i++))) >> 4, chr2 = (15 & enc2) << 4 | (enc3 = this._keyStr.indexOf(input.charAt(i++))) >> 2, chr3 = (3 & enc3) << 6 | (enc4 = this._keyStr.indexOf(input.charAt(i++))), output += String.fromCharCode(chr1), 64 != enc3 && (output += String.fromCharCode(chr2)), 64 != enc4 && (output += String.fromCharCode(chr3));
        return output = Base64._utf8_decode(output)
    },
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        for (var utftext = "", n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            c < 128 ? utftext += String.fromCharCode(c) : c > 127 && c < 2048 ? (utftext += String.fromCharCode(c >> 6 | 192), utftext += String.fromCharCode(63 & c | 128)) : (utftext += String.fromCharCode(c >> 12 | 224), utftext += String.fromCharCode(c >> 6 & 63 | 128), utftext += String.fromCharCode(63 & c | 128))
        }
        return utftext
    },
    _utf8_decode: function (utftext) {
        for (var string = "", i = 0, c = c1 = c2 = 0; i < utftext.length;)(c = utftext.charCodeAt(i)) < 128 ? (string += String.fromCharCode(c), i++) : c > 191 && c < 224 ? (c2 = utftext.charCodeAt(i + 1), string += String.fromCharCode((31 & c) << 6 | 63 & c2), i += 2) : (c2 = utftext.charCodeAt(i + 1), c3 = utftext.charCodeAt(i + 2), string += String.fromCharCode((15 & c) << 12 | (63 & c2) << 6 | 63 & c3), i += 3);
        return string
    }
};



function draw() {
    let width = parseFloat(elm.querySelector('[name="width"]').value.replace(",", ".")),
        height = parseFloat(elm.querySelector('[name="height"]').value.replace(",", ".")),
        bleed = parseFloat(elm.querySelector('[name="bleed"]').value.replace(",", ".")),
        paperweight = parseFloat(elm.querySelector('[name="paperweight"]').value.replace(",", ".")),
        numberofpages = parseFloat(elm.querySelector('[name="numberofpages"]').value.replace(",", ".")),
        typeofcover = parseFloat(elm.querySelector('[name="typeofcover"]').value.replace(",", ".")),
        papervolume = 0;
        

    if (elm.querySelector('[name="papervolume"]').value == 0) {
        elm.querySelector('[name="papervolumenumber"]').disabled = false;
        papervolume = parseFloat(elm.querySelector('[name="papervolumenumber"]').value.replace(",", "."))
    } else {
        elm.querySelector('[name="papervolumenumber"]').disabled = true;
        papervolume = parseFloat(elm.querySelector('[name="papervolume"]').value.replace(",", "."))
        elm.querySelector('[name="papervolumenumber"]').value = papervolume
    }
    spine = spinecalc(paperweight, papervolume, numberofpages, typeofcover) / 10;
    elm.querySelector('[name="spine"]').value = spine.toFixed(2)
    elm.querySelector('#temp') ? elm.querySelector('img').remove() : '';
    let svg = `
        <svg id="BookTemplate"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(width * 2) + spine + (bleed * 2)} ${height + (bleed * 2)}" width="${(width * 2) + spine + (bleed * 2)}cm" height="${height + (bleed * 2)}cm">
            <style>
                .obj{
                    fill: none;
                    stroke: #ff5722;
                    stroke-width: 0.0352778;
                }
                .description{
                    font-size: .5px;
                    fill: salmon;
                    font-family: monospace, 'Courier New', Courier ;
                }
                .cross{
                    stroke: #ff5722;
                    stroke-width: 0.0352778;
                }
            </style>
            <g>
            <rect id="bleed" class="obj" x="0" y="0" width="${(width * 2) + spine + (bleed * 2)}" height="${height + (bleed * 2)}" />
            <rect id="front" class="obj" x="${bleed}" y="${bleed}" width="${width}" height="${height}" />
            <rect id="back" class="obj" x="${width + spine + bleed}" y="${bleed}" width="${width}" height="${height}" />
            <rect id="spine" class="obj" x="${width + bleed}" y="${bleed}" width="${spine}" height="${height}" />
            <g>
                <line class="cross" x1="${bleed}" y1="${bleed}" x2="${bleed + width}" y2="${bleed + height}" />
                <line class="cross" x1="${bleed + width}" y1="${bleed}" x2="${bleed}" y2="${bleed + height}" />
            </g>
            <g>
                <line class="cross" x1="${bleed + width + spine}" y1="${bleed}" x2="${bleed + (width * 2) + spine}" y2="${bleed + height}" />
                <line class="cross" x1="${bleed + (width * 2) + spine}" y1="${bleed}" x2="${bleed + width + spine}" y2="${bleed + height}" />
            </g>
            </g>
            <text class="description" text-anchor="middle" x="${(bleed + (width / 2))}" y="${height}">Width:${width} CM - Height: ${height} CM - Spine: ${spine.toFixed(2)} CM</text>
        </svg>`;
    elm.insertAdjacentHTML('beforeend', `<img id="temp" alt="template" src="data:image/svg+xml;base64,${Base64.encode(svg)}">`)
    elm.querySelector('[name="save"]').setAttribute('href', `data:image/svg+xml;base64,${Base64.encode(svg)}`)

}

function spinecalc(paperweight, papervolume, numberofpages, typeofcover) {
    return ((paperweight * papervolume * numberofpages) / 20000) + typeofcover;
}

function p(set) {
    set = parseInt(set);
    set == 0 ? elm.querySelector('[name="preset"]').value = 0 : '';
    let presets = [
        [elm.querySelector('[name="width"]').value,
            elm.querySelector('[name="height"]').value,
            elm.querySelector('[name="bleed"]').value
        ],
        [16.5, 23.5, .5],
        [21, 28, .5],
        [14, 21, .5],
    ];
    elm.querySelector('[name="width"]').value = presets[set][0];
    elm.querySelector('[name="height"]').value = presets[set][1];
    elm.querySelector('[name="bleed"]').value = presets[set][2];
    draw();
}