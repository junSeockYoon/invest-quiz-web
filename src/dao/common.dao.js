// 1. [모듈 임포트]
// mybatis-mapper: XML 파일에 작성된 SQL을 불러와 사용하게 해주는 라이브러리
const mybatisMapper = require('mybatis-mapper'); 
// ../config/database.js: 실제 데이터베이스 연결 정보를 담고 있는 모듈 (DB connection pool)
const db = require('../config/database'); 
const commonUtil = require('../common/utils/common.util');
const colorConfig = require('../config/color.config');

const logger = require('../config/logger');

// 2. [초기 설정]
// SQL 쿼리의 포맷을 지정합니다. (언어, 들여쓰기 등)
const format = { language: 'sql', indent: '  ' };

// mybatis-mapper에게 SQL 쿼리가 어디에 저장되어 있는지 알려줍니다.
// __dirname은 현재 파일의 경로이며, '/mapper/main.xml' 파일을 로딩합니다.
// 이렇게 로딩된 SQL문들은 메모리에 저장되어 빠르게 찾아 쓸 수 있습니다.
mybatisMapper.createMapper([
    __dirname + '/mapper/main.xml', 
    __dirname + '/mapper/test.xml',
]);

const commonDao = async(mapperId, sqlId, params) => {
    try {
        const query = mybatisMapper.getStatement(mapperId, sqlId, params, format);

        if(process.env.NODE_ENV === 'development')
            console.log(colorConfig.FgMagenta+"%s"+colorConfig.Reset,"###################### " + sqlId + " ###################### \n"+query+";\n\n");

        const result = await db.execute(query);

        if(result[0].affectedRows) {
            // 생성, 수정, 삭제 시에는 현재 실행된 쿼리문에 영향을 받은 Row의 수가 리턴 된다.
            return result[0];
        } else {
            return commonUtil.convertCamelcase(result);
        }

    } catch(e) {
        logger.error(e);
        return null;
    }
};
// 서비스 계층에서 mapperId를 쉽게 사용할 수 있도록 네임스페이스를 상수로 정의합니다.
const mapper = {
    MAIN: "main",
    TEST: "test",
}

// 다른 파일에서 commonDao 함수와 mapper 객체를 사용할 수 있도록 export 합니다.
module.exports = {
    commonDao,
    mapper
};