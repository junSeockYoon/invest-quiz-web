const CryptoJS = require("crypto-js");
const appConfig = require('../../config/app.config');

const encryptedJSONString = data => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), appConfig.crypto.secretKey).toString();
};

const decryptedJSONString = data => {
    const bytes = CryptoJS.AES.decrypt(data, appConfig.crypto.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = {
    encryptedJSONString,
    decryptedJSONString,
}