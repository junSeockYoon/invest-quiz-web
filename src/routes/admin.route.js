const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

/****************************************************************************************
 *!                                     V I E W
 *  관리자 화면 렌더링
 ****************************************************************************************/
router.get('/', adminController.dashboard);
router.get('/results', adminController.resultList);
router.get('/level-results', adminController.levelResultList);
router.get('/level-results/:id', adminController.levelResultDetail);

/****************************************************************************************
 *!                                     A P I
 *  관리자용 통계 데이터 API
 ****************************************************************************************/
router.get('/api/dashboard', adminController.getDashboardData);

module.exports = router;

