const moment = require("moment");

const getCurrentDateTime = () => {
    return moment().format("YYYYMMDDHHmmss");
}

const putBehindIndex = (params) => {
    // 입출고 일자 14자로 변경한 후 뒤에 6자리를 인덱스로 쓴 이후 사용되는 함수
    if(params.startRegRange != undefined && params.startRegRange !== '') {
        params.startRegRange = moment(params.startRegRange, 'YYYYMMDDHHmm').format('YYYYMMDD000000');
    }
    if(params.endRegRange != undefined && params.endRegRange !== '') {
        params.endRegRange = moment(params.endRegRange, 'YYYYMMDDHHmm').format('YYYYMMDD999999');
    }

    return params;
}


const convertCalanderDate = (params) => {

    if(params.startRegRange != undefined && params.startRegRange !== '') {
        params.startRegRange = moment(params.startRegRange, 'YYYYMMDDHHmm').format('YYYYMMDD000000');
    }
    if(params.endRegRange != undefined && params.endRegRange !== '') {
        params.endRegRange = moment(params.endRegRange, 'YYYYMMDDHHmm').format('YYYYMMDD235959');
    }

    return params;
}

const convertCalanderOnlyDate = (params) => {

    if(params.startRegRange != undefined && params.startRegRange !== '') {
        params.startRegRange = moment(params.startRegRange, 'YYYYMMDD').format('YYYYMMDD');
    }
    if(params.endRegRange != undefined && params.endRegRange !== '') {
        params.endRegRange = moment(params.endRegRange, 'YYYYMMDD').format('YYYYMMDD');
    }

    return params;
}

const convertCalanderDetailDate = (params) => {

    if(params.startRegRange != undefined && params.startRegRange !== '') {
        params.startRegRange = moment(params.startRegRange, 'YYYYMMDDHHmm').format('YYYYMMDDHHmm00');
    }
    if(params.endRegRange != undefined && params.endRegRange !== '') {
        params.endRegRange = moment(params.endRegRange, 'YYYYMMDDHHmm').format('YYYYMMDDHHmm59');
    }

    return params;
}

const DateUtil = {
    getCurrentDateTime : () => {
        return moment().format("YYYYMMDDHHmmss");
    },
    putBehindIndex : (params) => {
        return putBehindIndex(params);
    },
    convertCalanderDate : (params) => {
        return convertCalanderDate(params);
    },
    convertCalanderOnlyDate : (params) => {
        return convertCalanderOnlyDate(params);
    },
    convertCalanderDetailDate: (params) => {
        return convertCalanderDetailDate(params);
    },
    getMonthDayName : () => {
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const dayOfWeek = today.getDay();
        const dayName = daysOfWeek[dayOfWeek];
        ment = month + "월 " + day + "일 " + dayName + "요일";
        return ment;
    },
}



module.exports = DateUtil;