const { commonDao, mapper } = require('../dao/common.dao');
const ResultModel = require('../models/common/result.model');
const logger = require('../config/logger');

const main = async () => {
    const resultModel = new ResultModel();
    try {
        const result = await commonDao(mapper.TEST, 'main');
        resultModel.successByData(result);
    } catch (error) {
        logger.error(error);
        resultModel.failureMessageException(null, error);    }
    return resultModel;
};

const submitResult = async (resultData) => {
    const resultModel = new ResultModel();
    try {
        // 마지막 유저 번호 조회
        const lastUserNumberResult = await commonDao(mapper.TEST, 'getLastUserNumber');
        const lastNumber = lastUserNumberResult && lastUserNumberResult.length > 0 ? lastUserNumberResult[0].lastNumber : 0;
        const nextUserNumber = lastNumber + 1;
        const userName = `USER_${nextUserNumber}`;

        // 퀴즈 결과 저장
        const insertResult = await commonDao(mapper.TEST, 'insertResult', {
            userName: userName,
            totalScore: resultData.totalScore,
            grade: resultData.grade
        });

        // insertId는 result[0].insertId에 저장됩니다 (commonDao에서 result[0]을 반환)
        const resultId = insertResult.insertId;

        if (!resultId) {
            throw new Error('결과 저장 실패: insertId를 가져올 수 없습니다');
        }

        // 퀴즈 상세 결과 저장 (각 detail을 개별적으로 저장)
        for (const detail of resultData.details || []) {
            // detail 이 null/undefined 이거나 questionNum 이 없으면 스킵
            if (!detail || detail.questionNum == null) {
                continue;
            }

            await commonDao(mapper.TEST, 'insertDetail', {
                resultId: resultId,
                questionNum: detail.questionNum,
                userAnswer: detail.userAnswer,
                isCorrect: detail.isCorrect,
                responseTimeMs: detail.responseTimeMs || 0
            });
        }

        resultModel.successByData({ resultId: resultId, userName: userName });
    } catch (error) {
        logger.error(error);
        resultModel.failureMessageException('결과 저장 중 오류가 발생했습니다.', error);
    }
    return resultModel;
};

const getResult = async (resultId) => {
    const resultModel = new ResultModel();
    try {
        // 결과 조회
        const result = await commonDao(mapper.TEST, 'getResult', { id: resultId });
        
        if (!result || result.length === 0) {
            throw new Error('결과를 찾을 수 없습니다.');
        }

        // 상세 결과 조회
        const details = await commonDao(mapper.TEST, 'getResultDetails', { resultId: resultId });
        
        const resultData = {
            ...result[0],
            details: details || []
        };

        resultModel.successByData(resultData);
    } catch (error) {
        logger.error(error);
        resultModel.failureMessageException('결과 조회 중 오류가 발생했습니다.', error);
    }
    return resultModel;
};

module.exports = {
    main,
    submitResult,
    getResult,
};