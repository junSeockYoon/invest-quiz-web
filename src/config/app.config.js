const path = require('path');

/**
 * 애플리케이션 설정 파일
 */
const appConfig = {
    // 파일 업로드 저장 경로
    file: {
        repositoryPath: path.join(__dirname, '../../public/uploads')
    },
    constants : {
        serviceSuccessKey: 'S',
        serviceFailKey: 'F',
        serviceErrorKey: 'E',
    },
};

module.exports = appConfig;

