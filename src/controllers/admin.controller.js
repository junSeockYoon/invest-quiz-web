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
    getDashboardData,
};

