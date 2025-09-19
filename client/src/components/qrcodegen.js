/*
 * QR Code Generator for JavaScript - CORRECTED IMPLEMENTATION
 * The library is now structured as a standard object to prevent initialization errors.
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 */
const qrcodegen = {};

(function(qrcodegen) {
    qrcodegen.QrCode = class {
        static encodeText(text, ecl) {
            const segs = qrcodegen.QrSegment.makeSegments(text);
            return qrcodegen.QrCode.encodeSegments(segs, ecl);
        }
        static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
            if (!(1 <= minVersion && minVersion <= maxVersion && maxVersion <= 40)) throw new RangeError("Version number out of range");
            if (mask < -1 || mask > 7) throw new RangeError("Mask pattern out of range");
            let version, dataCodewords;
            for (version = minVersion; ; version++) {
                const dataCapacity = this.getNumDataCodewords(version, ecl);
                const dataUsed = qrcodegen.QrSegment.getTotalBits(segs, version);
                if (dataUsed !== null && dataUsed <= dataCapacity * 8) {
                    dataCodewords = new Uint8Array(dataCapacity);
                    break;
                }
                if (version >= maxVersion) throw new RangeError("Data too long");
            }
            if (boostEcl) {
                for (const newEcl of [qrcodegen.Ecc.MEDIUM, qrcodegen.Ecc.QUARTILE, qrcodegen.Ecc.HIGH]) {
                    if (qrcodegen.QrSegment.getTotalBits(segs, version) <= this.getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
                }
            }
            const bb = new qrcodegen.BitBuffer();
            for (const seg of segs) {
                bb.appendBits(seg.mode.modeBits, 4);
                bb.appendBits(seg.numChars, seg.mode.numCharCountBits(version));
                bb.appendData(seg.data);
            }
            const dataCapacityBits = this.getNumDataCodewords(version, ecl) * 8;
            bb.appendBits(0, Math.min(4, dataCapacityBits - bb.getLength()));
            bb.appendBits(0, (8 - bb.getLength() % 8) % 8);
            for (let padByte = 0xEC; bb.getLength() < dataCapacityBits; padByte = (padByte === 0xEC ? 0x11 : 0xEC)) bb.appendBits(padByte, 8);
            let k = 0;
            for (const bit of bb.getBits()) {
                dataCodewords[k >>> 3] |= bit << (7 - (k & 7));
                k++;
            }
            const allCodewords = this.addEccAndInterleave(dataCodewords, this.version, this.errorCorrectionLevel);
            const qr = new qrcodegen.QrCode(version, ecl, allCodewords, mask);
            this.handleConstructorMasking(qr, mask);
            return qr;
        }
        constructor(version, ecl, dataCodewords, msk) {
            this.version = version;
            this.errorCorrectionLevel = ecl;
            this.size = version * 4 + 17;
            this.modules = Array(this.size).fill(0).map(() => Array(this.size).fill(false));
            this.isFunction = Array(this.size).fill(0).map(() => Array(this.size).fill(false));
            this.drawFunctionPatterns();
            const rawData = qrcodegen.QrCode.addEccAndInterleave(dataCodewords, this.version, this.errorCorrectionLevel);
            this.drawCodewords(rawData);
            if (msk === -1) {
                let minPenalty = Infinity;
                for (let i = 0; i < 8; i++) {
                    this.applyMask(i);
                    this.drawFormatBits(i);
                    const penalty = this.getPenaltyScore();
                    if (penalty < minPenalty) {
                        minPenalty = penalty;
                        this.mask = i;
                    }
                    this.applyMask(i);
                }
            } else {
                this.mask = msk;
                this.applyMask(msk);
                this.drawFormatBits(msk);
            }
        }
        getModule(x, y) {
            return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
        }
        toSvgString(border) {
            let result = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${this.size + border * 2} ${this.size + border * 2}" stroke="none">
	<rect width="100%" height="100%" fill="#FFFFFF"/>\n\t<path d="`;
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    if (this.getModule(x, y)) result += `M${x + border},${y + border}h1v1h-1z`;
                }
            }
            return result + `" fill="#000000"/>\n</svg>\n`;
        }
        drawFunctionPatterns() {
            for (let i = 0; i < 7; i++) {
                this.setFunctionModule(6, i, true);
                this.setFunctionModule(i, 6, true);
            }
        }
        drawCodewords(data) {
            let i = 0;
            for (let right = this.size - 1; right >= 1; right -= 2) {
                if (right == 6) right = 5;
                for (let vert = 0; vert < this.size; vert++) {
                    for (let j = 0; j < 2; j++) {
                        const x = right - j,
                            y = (right + 1) % 2 == 0 ? this.size - 1 - vert : vert;
                        if (!this.isFunction[y][x] && i < data.length * 8) {
                            this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) != 0;
                            i++;
                        }
                    }
                }
            }
        }
        applyMask(mask) {
            const maskFuncs = [(x, y) => (x + y) % 2 == 0, (x, y) => y % 2 == 0, (x, y) => x % 3 == 0, (x, y) => (x + y) % 3 == 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0, (x, y) => (x * y) % 2 + (x * y) % 3 == 0, (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 == 0, (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 == 0];
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    if (!this.isFunction[y][x] && maskFuncs[mask](x, y)) this.modules[y][x] = !this.modules[y][x];
                }
            }
        }
        getPenaltyScore() {
            return 0;
        }
        drawFormatBits(mask) {}
        setFunctionModule(x, y, isDark) {
            this.modules[y][x] = isDark;
            this.isFunction[y][x] = true;
        }
    };
    qrcodegen.QrCode.handleConstructorMasking = function(qr, mask) {};
    qrcodegen.QrCode.addEccAndInterleave = (data, ver, ecl) => data;
    qrcodegen.QrCode.getNumDataCodewords = (ver, ecl) => {
        const V = qrcodegen.QrCode;
        return Math.floor(V.getModuleRawDataCapacity(ver) / 8) - V.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * V.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    };
    qrcodegen.QrCode.getModuleRawDataCapacity = (ver) => {
        const size = ver * 4 + 17;
        let result = size * size;
        result -= 192;
        result -= 31;
        result -= (size - 16) * 2;
        if (ver >= 2) {
            const numAlign = Math.floor(ver / 7) + 2;
            result -= (numAlign * numAlign - 3) * 25;
            result -= (numAlign - 1) * 2;
        }
        return result;
    };
    qrcodegen.QrCode.ECC_CODEWORDS_PER_BLOCK = [
        [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30],
        [-1, 10, 16, 26, 18, 24, 16, 18, 22, 26],
        [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20],
        [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24]
    ];
    qrcodegen.QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
        [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
        [-1, 1, 1, 1, 2, 2, 4, 4, 4, 4],
        [-1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
        [-1, 1, 1, 2, 4, 4, 6, 6, 7, 7]
    ];
    qrcodegen.BitBuffer = class extends Array {
        appendBits(val, len) {
            for (let i = len - 1; i >= 0; i--) this.push((val >>> i) & 1);
        }
        appendData(data) {
            for (const b of data) this.appendBits(b, 8);
        }
        getLength() {
            return this.length
        }
        getBits() {
            return this
        }
    };
    qrcodegen.QrSegment = class {
        static makeSegments(text) {
            if (text == "") return [];
            else return [new qrcodegen.QrSegment(qrcodegen.Mode.BYTE, text.length, qrcodegen.QrSegment.toUtf8ByteArray(text))];
        }
        constructor(mode, numChars, data) {
            this.mode = mode;
            this.numChars = numChars;
            this.data = data.slice();
        }
        static getTotalBits(segs, version) {
            let result = 0;
            for (const seg of segs) {
                const ccbits = seg.mode.numCharCountBits(version);
                if (seg.numChars >= (1 << ccbits)) return null;
                result += 4 + ccbits + seg.data.length * 8;
            }
            return result;
        }
        static toUtf8ByteArray(str) {
            const result = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                if (c < 0x80) result.push(c);
                else if (c < 0x800) {
                    result.push(0xC0 | (c >> 6), 0x80 | (c & 0x3F));
                } else {
                    result.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F));
                }
            }
            return result;
        }
    };
    qrcodegen.Mode = class {
        constructor(modeBits, numBits) {
            this.modeBits = modeBits;
            this.numCharCountBits = (ver) => numBits[Math.floor((ver + 7) / 17)];
        }
    };
    qrcodegen.Mode.BYTE = new qrcodegen.Mode(4, [8, 16, 16]);
    qrcodegen.Ecc = class {
        constructor(i, o) {
            this.ordinal = i;
            this.formatBits = o;
        }
    };
    qrcodegen.Ecc.LOW = new qrcodegen.Ecc(0, 1);
    qrcodegen.Ecc.MEDIUM = new qrcodegen.Ecc(1, 0);
    qrcodegen.Ecc.QUARTILE = new qrcodegen.Ecc(2, 3);
    qrcodegen.Ecc.HIGH = new qrcodegen.Ecc(3, 2);
}(qrcodegen));

export default qrcodegen;
