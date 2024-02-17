// import * as CryptoJS from 'crypto-js';
const CryptoJS = require('crypto-js');

module.exports.decryptPasswrod = function  (pass)
{
    let key = "encrypt!135790";
    return CryptoJS.AES.decrypt(pass,key).toString(CryptoJS.enc.Utf8);
}