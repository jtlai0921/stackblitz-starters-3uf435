/**
 * base64處理
 */
/*
* Modify for javascript by Wei 2018/5/7
* Retrun is Object
* 		status: false, 成功與否狀態
* 		value: '', encode或decode的值
* 		error: '', 錯誤的encode或decode的值
* 		msg: '',
* 		errorCode: ''
* ErrorCode:
* 	-1 : 不明錯誤
* [Encode]
*  101: Formate Error (length)
*  102: Formate Error
*  103: Unknow Error
*
* [Decode]
*  201: Formate Error (length)
*  202: Formate Error
*  203: Unknow Error
*
* [EDI Encode]
*  302: Formate Error
* [EDI Decode]
* 	402: Formate Error
*
*/
/*
* Encapsulation of Nick Galbreath's base64.js library for AngularJS
* Original notice included below
*/

/*
* Copyright (c) 2010 Nick Galbreath
* http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/* base64 encode/decode compatible with window.btoa/atob
*
* window.atob/btoa is a Firefox extension to convert binary data (the "b")
* to base64 (ascii, the "a").
*
* It is also found in Safari and Chrome.  It is not available in IE.
*
* if (!window.btoa) window.btoa = base64.encode
* if (!window.atob) window.atob = base64.decode
*
* The original spec's for atob/btoa are a bit lacking
* https://developer.mozilla.org/en/DOM/window.atob
* https://developer.mozilla.org/en/DOM/window.btoa
*
* window.btoa and base64.encode takes a string where charCodeAt is [0,255]
* If any character is not [0,255], then an exception is thrown.
*
* window.atob and base64.decode take a base64-encoded string
* If the input length is not a multiple of 4, or contains invalid characters
*   then an exception is thrown.
*/

import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class Base64Service {
    /**
     * 參數處理
     */
    private PADCHAR = '=';
    private ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


    constructor(
    ) {
    }


    decode(s) {
        // convert to string
        s = "" + s;
        s = s.replace(/\r\n|\n|\r|\\r\\n|\\n|\\r/g, '');
        var pads, i, b10;
        var imax = s.length;
        if (imax == 0) {
            // return s;
            return this.outputResult(s);
        }

        if (imax % 4 != 0) {
            // throw "Cannot decode base64";
            return this.outputResult('', { msg: "Cannot decode base64", errorCode: '201' });
        }

        pads = 0;
        if (s.charAt(imax - 1) == this.PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) == this.PADCHAR) {
                pads = 2;
            }
            // either way, we want to ignore this last block
            imax -= 4;
        }

        var x = [];

        try {
            for (i = 0; i < imax; i += 4) {
                b10 = (this.getbyte64(s, i) << 18) | (this.getbyte64(s, i + 1) << 12) |
                    (this.getbyte64(s, i + 2) << 6) | this.getbyte64(s, i + 3);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
            }

            switch (pads) {
                case 1:
                    b10 = (this.getbyte64(s, i) << 18) | (this.getbyte64(s, i + 1) << 12) | (this.getbyte64(s, i + 2) << 6);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                    break;
                case 2:
                    b10 = (this.getbyte64(s, i) << 18) | (this.getbyte64(s, i + 1) << 12);
                    x.push(String.fromCharCode(b10 >> 16));
                    break;
            }
        } catch (error) {
            if (typeof error === 'string') {
                return this.outputResult(x.join(''), {
                    msg: error, errorCode: '202'
                });
            } else {
                return this.outputResult(x.join(''), {
                    msg: 'Encode try error', errorCode: '203'
                });
            }
        }
        // return x.join('');
        return this.outputResult(x.join(''));
    }


    encode(s) {
        if (arguments.length != 1) {
            // throw "SyntaxError: Not enough arguments";
            return this.outputResult('', { msg: "SyntaxError: Not enough arguments", errorCode: '101' });
        }

        var i, b10;
        var x = [];

        // convert to string
        s = "" + s;

        var imax = s.length - s.length % 3;

        if (s.length == 0) {
            // return s;
            return this.outputResult(s);
        }
        try {
            for (i = 0; i < imax; i += 3) {
                b10 = (this.getbyte(s, i) << 16) | (this.getbyte(s, i + 1) << 8) | this.getbyte(s, i + 2);
                x.push(this.ALPHA.charAt(b10 >> 18));
                x.push(this.ALPHA.charAt((b10 >> 12) & 0x3F));
                x.push(this.ALPHA.charAt((b10 >> 6) & 0x3f));
                x.push(this.ALPHA.charAt(b10 & 0x3f));
            }
            switch (s.length - imax) {
                case 1:
                    b10 = this.getbyte(s, i) << 16;
                    x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 0x3F) +
                        this.PADCHAR + this.PADCHAR);
                    break;
                case 2:
                    b10 = (this.getbyte(s, i) << 16) | (this.getbyte(s, i + 1) << 8);
                    x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 0x3F) +
                        this.ALPHA.charAt((b10 >> 6) & 0x3f) + this.PADCHAR);
                    break;
            }
        } catch (error) {
            if (typeof error === 'string') {
                return this.outputResult(x.join(''), {
                    msg: error, errorCode: '102'
                });
            } else {
                return this.outputResult(x.join(''), {
                    msg: 'Encode try error', errorCode: '103'
                });
            }
        }
        // return x.join('');
        return this.outputResult(x.join(''));
    }


    bytesToHex(s) {
        let byteArray = [];
        let i: any = 0;
        for (i = 0; i < s.length; i++) {
            byteArray.push(s.charCodeAt(i));
        }
        return Array.from(byteArray, (byte) => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('').toLocaleUpperCase();
    }

    base64ToBlob(base64Str, contentType, sliceSize?) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(base64Str);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------


    private outputResult(str, set_obj?: any) {
        let output = {
            status: false,
            value: '',
            error: '',
            msg: '',
            errorCode: ''
        };
        if (typeof set_obj === 'object') {
            output.status = false;
            output.error = str;
            output.msg = (typeof set_obj['msg'] !== 'undefined') ? set_obj['msg'] : 'Error Formate';
            output.errorCode = (typeof set_obj['errorCode'] !== 'undefined') ? set_obj['errorCode'] : '-1';
        } else if (str !== '') {
            output.status = true;
            output.value = str;
        }
        return output;
    }


    private getbyte(s, i) {
        let x = s.charCodeAt(i);
        if (x > 255) {
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        }
        return x;
    }

    private getbyte64(s, i) {
        let idx = this.ALPHA.indexOf(s.charAt(i));
        if (idx == -1) {
            throw "Cannot decode base64";
        }
        return idx;
    }


}
