const { testService } = require('../services');


async function main(req, res) {
    try {
        const result = await testService.main();

        res.render('test/main', { result });
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

async function getResult(req, res) {
    try {
        const resultId = req.params.id;
        const result = await testService.getResult(resultId);

        if (result.info.status === 'S') {
            res.render('test/result', { result });
        } else {
            res.status(404).send('결과를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('=== 결과 조회 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

module.exports = {
    main,
    submitResult,
    getResult,
};