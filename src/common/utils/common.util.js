const lodash = require("lodash");
const moment = require("moment");

const multer  = require('multer');
const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const appConfig = require("../../config/app.config");
const crypto = require('crypto');
const MobileDetect = require('mobile-detect');

/**
 * 6자리 숫자 생성 함수
 * @returns
 */
function generateCryptoRandomNumber() {
    const randomBuffer = crypto.randomBytes(4);
    const randomNumber = parseInt(randomBuffer.toString('hex'), 16) % 900000 + 100000;
    return randomNumber;
}

/**
 * JSON Object의 KEY값을 snake_case에서 camelCase로 변환한다.
 * @param {*} object
 * @returns
 */
const convertCamelcase = object => {
    let dataObject = [];
    try {
        for(let i = 0; i < object[0].length; i++) {
            dataObject[i] = lodash.mapKeys(object[0][i], function(value, key){
                return lodash.camelCase(key);
            });
        }
    } catch(e) {
        console.log("[Exception] convertCamelcase() : ", e);
    }

    return dataObject;
};

/**
 * 새로운 회원 코드 아이디를 생성한다.
 * @param {*} prevCode
 * @param {*} lastCode
 * @returns
 */
 const getNewNumberCd = (prevCode, lastCode) => {

    console.log("prevCode : ", prevCode);
    console.log("lastCode : ", lastCode);

    const curYYMM = moment().format("YYMM");
    let newCd = "";

    if(lastCode === undefined || lastCode === null || lastCode === "" ) {
        // SP_USER 테이블에 정보가 없는 경우
        newCd = prevCode + curYYMM + "000001";

    } else {
        const lastCdYYMM = lastCode.substring(2, 6);

        // 월이 바뀌면 000001 부터 다시 시작한다.
        if(curYYMM > lastCdYYMM) {
            // 월 바뀜
            newCd = prevCode + curYYMM + "000001";
        } else {
            // 월 안바뀜
            const lastCdNum = lastCode.substring(2);
            newCd = prevCode + (Number(lastCdNum) + 1);
        }
    }

    return newCd;
}

/**
 * 새로운 기업 코드 아이디를 생성한다.
 * @param {*} prevCode
 * @param {*} lastCode
 * @returns
 */
const getNewCmpnyCd = (prevCode, lastCode) => {

    console.log("prevCode : ", prevCode);
    console.log("lastCode : ", lastCode);

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomString = '';
    for (var i = 0; i < 6; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        randomString += chars.charAt(randomIndex);
    }

    const curYYMM = moment().format("YYMM");

    const newCd = prevCode + curYYMM + randomString;

    return newCd;
}

/**
 * multer
 */
const commonMulter = (pathType) => {
    console.log("####", pathType);
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const uploadDir = appConfig.file.repositoryPath + pathType + moment().format('/YYYY/MM/DD');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                cb(null, uploadDir);
            },
            filename: function (req, file, cb) {
                const ext = path.extname(file.originalname);
                cb(null, uuidv4() + ext);
            }
        }),
        limits: {
            fieldSize: 5 * 1024 * 1024 // 5MB
        }
    });
}

function isMobile(req)  {
    const userAgent = req.headers['user-agent'];
    const md = new MobileDetect(userAgent);
    const isMobile = !!md.mobile();

    return isMobile;
}

module.exports = {
    convertCamelcase,
    getNewNumberCd,
    getNewCmpnyCd,
    commonMulter,
    generateCryptoRandomNumber,
    isMobile,
}