const { testService } = require('../services');


async function main(req, res) {
    try {
        // 챕터 선택 화면으로 리다이렉트
        res.redirect('/test/chapters');
    } catch (error) {
        console.error('=== 메인 페이지 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

async function submitResult(req, res) {
    try {
        const resultData = req.body;
        const result = await testService.submitResult(resultData);

        if (result.info.status === 'S') {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('=== 결과 저장 에러 ===');
        console.error(error);
        res.status(500).json({
            info: { status: 'F', message: '서버 오류가 발생했습니다.' }
        });
    }
}

async function showChapters(req, res) {
    try {
        res.render('test/chapters');
    } catch (error) {
        console.error('=== 챕터 선택 화면 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

async function getChapters(req, res) {
    try {
        const result = await testService.getChapters();
        
        if (result.info.status === 'S') {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('=== 챕터 목록 조회 에러 ===');
        console.error(error);
        res.status(500).json({
            info: { status: 'F', message: '서버 오류가 발생했습니다.' }
        });
    }
}

async function getQuestionsByChapter(req, res) {
    try {
        const chapterId = req.params.chapterId;
        const result = await testService.getQuestionsByChapter(chapterId);

        if (result.info.status === 'S') {
            res.render('test/main', { result });
        } else {
            res.status(500).send('문제를 불러올 수 없습니다.');
        }
    } catch (error) {
        console.error('=== 챕터별 문제 조회 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

module.exports = {
    main,
    submitResult,
    showChapters,
    getChapters,
    getQuestionsByChapter,
};