// 데이터베이스에 직접 접근하여 쿼리를 실행하는 역할을 하는
// commonDao와 쿼리 정보가 담긴 mapper 객체를 가져옵니다.
const { commonDao, mapper } = require('../dao/common.dao');

/**
 * 메인 페이지에 필요한 모든 게시글을 조회하는 서비스
 */
const index = async () => {
    try {
        // 1. [DAO에 작업 전달] 컨트롤러로부터 받은 요청을 DAO에 전달합니다.
        // 'mapper.MAIN' 네임스페이스에 있는 'index'라는 ID의 쿼리를 실행하라고 지시합니다.
        const result = await commonDao(mapper.MAIN, 'index');
        
        // 2. [결과 반환] DAO로부터 받은 결과를 컨트롤러에게 그대로 돌려줍니다.
        return result;
    } catch (error) {
        // 3. [에러 처리] 만약 DAO에서 쿼리 실행 중 에러가 발생하면,
        // 그 에러를 호출한 쪽(컨트롤러)으로 다시 던져서 컨트롤러가 최종 처리하도록 합니다.
        throw error;
    }
};

/**
 * 특정 ID의 게시글을 상세 조회하는 서비스
 */
const detail = async (id) => {
    try {
        // DAO에 'detail' 쿼리를 실행하라고 지시하며, 쿼리에 필요한 { id } 값을 함께 전달합니다.
        const result = await commonDao(mapper.MAIN, 'detail', { id });
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * 특정 ID의 게시글을 수정하는 서비스
 */
const update = async (params) => {
    try {
        // DAO에 'update' 쿼리를 실행하라고 지시하며, 쿼리에 필요한 { id, title, content } 값을 전달합니다.
        const result = await commonDao(mapper.MAIN, 'update', params);
        return result;  
    } catch (error) {
        throw error;
    }
};

/**
 * 특정 ID의 게시글을 삭제하는 서비스
 */
const deletePost = async (id) => {
    try {
        // DAO에 'delete' 쿼리를 실행하라고 지시하며, { id } 값을 전달합니다.
        const result = await commonDao(mapper.MAIN, 'delete', { id });
        return result;
    } catch (error) {
        throw error;
    }
};

// 위에서 정의한 서비스 함수들을 컨트롤러에서 사용할 수 있도록 export 합니다.
module.exports = {
    index,
    detail,
    update,
    deletePost
};