/**
 * 憑證白名單
 * 檢核server的issuer、fingerprint、public key
 * 請陸續增加
 */
import { environment } from '@environments/environment';

/**
 * [CertTime] 2020-08
 * [CertInfo] 測試版
 */
let cert_test = {
    ignor: false,
    time: '2020-07-17',
    issuer: 'TAIWAN-CA',
    sha1: 'AA A4 BB 1A 56 CA CC DD EA EE 25 GG FF AA 1A 89 CC 88 82 F0',
    publicKey: 'Msdfsdfsdfsdfsdfsfsfsfewwegdsgfsfgfsggdgfdgdfgfdgdfgdfgdfgwj9o' +
        'QsfdsdfdsfsdsdfsfsfsfsfsfsfsffsfsfsfsfsfsfsfsfsfsfsffffsdsfJ7fEbL' +
        'sdfsdfsdfsdf'
};
if (environment.PRODUCTION) {
    // 正式要把測試的清掉
    cert_test = {
        ignor: true,
        time: '',
        issuer: '',
        sha1: '',
        publicKey: ''
    };
}
/**
 * [CertTime] 2020-08
 * [CertInfo] 初版
 */
const cert_1 = {
    ignor: false,
    time: '',
    issuer: '',
    sha1: '',
    publicKey: ''
};

/**
 * [CertTime] yyyy-mm-dd
 * [CertInfo] 替換版
 */
const cert_2 = {
    ignor: true,
    time: '',
    issuer: '',
    sha1: '',
    publicKey: ''
};


export const VERIFY_CERTS_INFO = [
    cert_test,
    cert_1
    // , cert_2
];
