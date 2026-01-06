const ResultInfo = require("./resultInfo.model");
const ResultData = require("./resultData.model");
const ResultError = require("./resultError.model");
const appConfig = require("../../config/app.config");

class ResultModel {
    constructor() {
        this.info = new ResultInfo();
        this.dataset = new ResultData();
        this.error = new ResultError();
    }

    success() {
        this.info.status = appConfig.constants.serviceSuccessKey;
    }

    successByCount(count) {        
        this.info.status = appConfig.constants.serviceSuccessKey;
        this.info.count = count;
    }

    successByData(dataList) {
        let count = 0;
        if(dataList.length !== undefined) {
            count = dataList.length;
        }

        this.info.status = appConfig.constants.serviceSuccessKey;
        this.info.count = count;
        this.dataset.data = dataList;        
    }

    successByDataPage(dataList, page) {
        this.info.status = appConfig.constants.serviceSuccessKey;
        this.info.count = dataList.length;
        this.dataset.data = dataList;
        this.dataset.page = page;
    }

    failure() {
        this.info.status = appConfig.constants.serviceFailKey;
    }

    failureMessage(message) {
        this.info.status = appConfig.constants.serviceFailKey;
        this.info.message = message;
    }

    failureMessage(key, message) {
        this.info.status = appConfig.constants.serviceFailKey;
        this.info.statusKey = key;
        this.info.message = message;
    }

    failureMessageByData(key, message, dataList) {
        this.info.status = appConfig.constants.serviceFailKey;
        this.info.statusKey = key;
        this.info.message = message;
        this.dataset.data = dataList;        
    }

    failureException(exception) {
        this.info.status = appConfig.constants.serviceFailKey;
        this.error.type = appConfig.constants.serviceFailKey;
        this.error.message = exception;
    }

    failureMessageException(message, exception) {
        this.info.status = appConfig.constants.serviceFailKey;
        this.info.message = message;
        this.error.type = appConfig.constants.serviceFailKey;
        this.error.message = exception;
    }
}

module.exports = ResultModel;