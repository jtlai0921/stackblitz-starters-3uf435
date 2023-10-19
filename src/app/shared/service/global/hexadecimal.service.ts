import { Injectable } from '@angular/core';

/**
 * 十六進位制編碼處理
 */
@Injectable()
export class HexadecimalService {
    
    /**
     * 參數設定
     */
    constructor() {}

    /**
     * Base64字串轉換Hex字串
     * @param base64Str 原始Base64字串
     */
    public base64toHex(base64Str) {
        var raw = atob(base64Str);
        var HEX = '';
        var _hex;
        for (var i = 0; i < raw.length; i++) {
            _hex = raw.charCodeAt(i).toString(16);
            HEX += (_hex.length==2?_hex:'0'+_hex);
        }
        return HEX.toUpperCase();
    }

    /**
     * Hex字串轉換Base64字串
     * @param hexStr 原始Hex字串
     */
    public hextoBase64(hexStr) {
        return btoa(String.fromCharCode.apply(null, 
            hexStr.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    /**
     * Hex字串轉換byte array
     * @param hexStr 原始Hex字串
     */
    public hexToBytes(hexStr)
    {
        if (hexStr.length % 2 != 0)
            throw "Invalid hexString";
        var arrayBuffer = new Uint8Array(hexStr.length / 2);
        for (var i = 0; i < hexStr.length; i += 2) {
            var byteValue = parseInt(hexStr.substr(i, 2), 16);
            if (byteValue == NaN)
                throw "Invalid hexString";
            arrayBuffer[i/2] = byteValue;
        }
        return arrayBuffer;
    }

    /**
     * byte array轉換Hex字串
     * @param bytes 原始位元組陣列
     */
    public bytesToHex(bytes)
    {
        if (!bytes)
            return null;     
        bytes = new Uint8Array(bytes);
        var hexBytes = [];
        for (var i = 0; i < bytes.length; ++i) {
            var byteString = bytes[i].toString(16);
            if (byteString.length < 2)
                byteString = "0" + byteString;
            hexBytes.push(byteString);
        }
        return hexBytes.join("");
    }

    /**
     * Hex字串轉換UTF-8字串
     * @param hexStr 原始Hex字串
     */
    public hexToUtf8(hexStr) {
        return this.fromUTF8Array(this.hexToBytes(hexStr));
    }

    /**
     * UTF-8字串轉換Hex字串
     * @param utf8Str 原始UTF-8字串
     */
    public utf8ToHex(utf8Str) {
        return this.bytesToHex(this.toUTF8Array(utf8Str));
    }

    /**
     * UTF-8字串轉換成byte array
     * @param str UTF-8字串
     */
    public toUTF8Array(str) {
        var utf8 = [];
        for (var i=0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                          | (str.charCodeAt(i) & 0x3ff))
                utf8.push(0xf0 | (charcode >>18), 
                          0x80 | ((charcode>>12) & 0x3f), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    /**
     * byte array轉換成UTF-8字串
     * @param data byte array
     */
    public fromUTF8Array(data) { // array of bytes
        var str = '',
            i;
    
        for (i = 0; i < data.length; i++) {
            var value = data[i];
    
            if (value < 0x80) {
                str += String.fromCharCode(value);
            } else if (value > 0xBF && value < 0xE0) {
                str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                i += 1;
            } else if (value > 0xDF && value < 0xF0) {
                str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                i += 2;
            } else {
                // surrogate pair
                var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;
    
                str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00); 
                i += 3;
            }
        }
    
        return str;
    }

    /**
     * XOR運算
     * @param target 目標對象 byte array
     * @param dependecy 運算依賴對象 byte array
     * @returns 運算結果 byte array
     */
    public xor(target, dependecy){
        let result = [];
        let element;
        for (var i = 0; i < target.length; i++) {
            element = target[i] ^ dependecy[i];
            result.push(element);
        }
        return result;
    }
}
