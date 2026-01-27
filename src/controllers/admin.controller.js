const { testService } = require('../services');

// 관리자 대시보드 화면
async function dashboard(req, res) {
    try {
        res.render('admin/dashboard');
    } catch (error) {
        console.error('=== 관리자 대시보드 렌더링 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

// 퀴즈 결과 리스트 화면
async function resultList(req, res) {
    try {
        // 지금은 퍼블리싱만, 실제 데이터 없이 템플릿만 렌더링
        res.render('admin/result-list');
    } catch (error) {
        console.error('=== 관리자 결과 리스트 렌더링 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

// 레벨 테스트 결과 리스트 화면
async function levelResultList(req, res) {
    try {
        // 지금은 퍼블리싱만, 실제 데이터 없이 템플릿만 렌더링
        res.render('admin/level-results');
    } catch (error) {
        console.error('=== 레벨 테스트 결과 리스트 렌더링 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

// 레벨 테스트 결과 상세 화면
async function levelResultDetail(req, res) {
    try {
        // 퍼블리싱용: URL의 id만 템플릿에 전달 (실제 데이터 연동은 추후)
        const resultId = req.params.id;
        res.render('admin/level-result-detail', { resultId });
    } catch (error) {
        console.error('=== 레벨 테스트 결과 상세 렌더링 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}
// 관리자 대시보드 데이터 API
async function getDashboardData(req, res) {
    try {
        const result = await testService.getAdminDashboardData();

        if (result.info.status === 'S') {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('=== 관리자 대시보드 데이터 조회 에러 ===');
        console.error(error);
        res.status(500).json({
            info: { status: 'F', message: '서버 오류가 발생했습니다.' },
        });
    }
}

module.exports = {
    dashboard,
    resultList,
    levelResultList,
    levelResultDetail,
    getDashboardData,
};

