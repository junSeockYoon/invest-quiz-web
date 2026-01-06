// 서비스 계층(실제 비즈니스 로직을 처리하는 부분)에서 mainService 객체를 가져옵니다.
// 컨트롤러는 여기서 가져온 서비스의 함수들을 호출해서 실제 작업을 시킵니다.
const { mainService } = require('../services');

/**
 * 메인 페이지를 렌더링하는 컨트롤러
 * 모든 게시글 목록을 보여주는 역할을 합니다.
 */
async function index(req, res) {
    try {
       

        // 2. [응답] 서비스로부터 받은 결과(result)를 'main'이라는 EJS 템플릿에 담아
        //    HTML 페이지로 그려서 사용자에게 보여줍니다. 
        res.render('main');
    } catch (error) {
        // 만약 서비스에서 데이터를 가져오다 에러가 발생하면, 사용자에게 서버 오류 메시지를 보냅니다.
        console.error('=== 메인 페이지 에러 ===');
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}



// 위에서 정의한 컨트롤러 함수들을 다른 파일(주로 라우터)에서 사용할 수 있도록 export 합니다.
// delete는 자바스크립트 예약어이므로 deletePost라는 이름으로 내보냅니다.
module.exports = {
    index,
};