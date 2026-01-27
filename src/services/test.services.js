const { commonDao, mapper } = require('../dao/common.dao');
const ResultModel = require('../models/common/result.model');
const logger = require('../config/logger');

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
            chapterId: resultData.chapterId || null
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

const getChapters = async () => {
    const resultModel = new ResultModel();
    try {
        const chapters = await commonDao(mapper.TEST, 'getChapters');
        resultModel.successByData(chapters || []);
    } catch (error) {
        logger.error(error);
        resultModel.failureMessageException('챕터 목록 조회 중 오류가 발생했습니다.', error);
    }
    return resultModel;
};

const getQuestionsByChapter = async (chapterId) => {
    const resultModel = new ResultModel();
    try {
        const questions = await commonDao(mapper.TEST, 'getQuestionsByChapter', { chapterId: chapterId });
        resultModel.successByData(questions || []);
    } catch (error) {
        logger.error(error);
        resultModel.failureMessageException('문제 조회 중 오류가 발생했습니다.', error);
    }
    return resultModel;
};

const getAdminDashboardData = async () => {
    const resultModel = new ResultModel();
    try {
        // TODO: 실제 DB 연동 전까지는 가짜 데이터(목업 데이터)를 반환합니다.
        const chapterSummary = [
            { chapterId: 1, chapterTitle: '환율 (Exchange Rate)', attemptCount: 12, avgScore: 4.2 },
            { chapterId: 2, chapterTitle: '금리 (Interest Rate)', attemptCount: 9, avgScore: 3.7 },
            { chapterId: 3, chapterTitle: '인플레이션 (Inflation)', attemptCount: 6, avgScore: 2.9 },
            { chapterId: 4, chapterTitle: '경제성장률 (GDP Growth)', attemptCount: 4, avgScore: 3.2 },
            { chapterId: 5, chapterTitle: '경상수지 및 무역수지 (Balance of Trade)', attemptCount: 3, avgScore: 2.5 },
        ];

        const now = new Date();
        const recentResults = [
            { id: 101, userName: 'USER_1', chapterTitle: '환율 (Exchange Rate)', totalScore: 5, createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString() },
            { id: 102, userName: 'USER_2', chapterTitle: '금리 (Interest Rate)', totalScore: 3, createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString() },
            { id: 103, userName: 'USER_3', chapterTitle: '인플레이션 (Inflation)', totalScore: 4, createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString() },
            { id: 104, userName: 'USER_4', chapterTitle: '경제성장률 (GDP Growth)', totalScore: 2, createdAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString() },
            { id: 105, userName: 'USER_5', chapterTitle: '환율 (Exchange Rate)', totalScore: 1, createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString() },
            { id: 106, userName: 'USER_6', chapterTitle: '금리 (Interest Rate)', totalScore: 5, createdAt: new Date(now.getTime() - 1000 * 60 * 75).toISOString() },
            { id: 107, userName: 'USER_7', chapterTitle: '경상수지 및 무역수지 (Balance of Trade)', totalScore: 3, createdAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString() },
        ];

        resultModel.successByData({
            chapterSummary: chapterSummary || [],
            recentResults: recentResults || [],
        });
    } catch (error) {
        logger.error(error);
        resultModel.failureMessageException('관리자 대시보드 데이터 조회 중 오류가 발생했습니다.', error);
    }
    return resultModel;
};

module.exports = {
    submitResult,
    getChapters,
    getQuestionsByChapter,
    getAdminDashboardData,
};