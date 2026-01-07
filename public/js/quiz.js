/**
 * 퀴즈 페이지 JavaScript
 */

// 퀴즈 데이터 및 상태 관리
let quizData = {
    questions: [],
    currentIndex: 0,
    answers: [], // 사용자가 선택한 답변 저장
    totalQuestions: 0,
    startTime: null, // 퀴즈 시작 시각
    questionStartTime: null // 현재 문항 시작 시각
};

/**
 * 퀴즈 초기화
 * @param {Array} questions - 질문 배열
 */
function initQuiz(questions) {
    if (!questions || questions.length === 0) {
        console.error('질문 데이터가 없습니다.');
        return;
    }

    quizData.questions = questions;
    quizData.totalQuestions = questions.length;
    quizData.currentIndex = 0;
    quizData.answers = [];
    quizData.startTime = Date.now(); // 전체 퀴즈 시작 시간 기록
    quizData.questionStartTime = null;

    // 첫 번째 질문 표시
    displayQuestion(0);
    updateProgress(0);
}

/**
 * 질문 표시
 * @param {number} index - 질문 인덱스
 */
function displayQuestion(index) {
    if (index < 0 || index >= quizData.questions.length) {
        return;
    }

    const question = quizData.questions[index];
    
    // 현재 문항 시작 시각 기록
    quizData.questionStartTime = Date.now();

    // 질문 텍스트 업데이트
    document.getElementById('question-text').textContent = question.content;
    
    // 챕터 정보 업데이트
    document.getElementById('chapter-title').textContent = `[제 ${getChapterNumber(question.chapterTitle)}장] ${question.chapterTitle}`;
    document.getElementById('chapter-description').textContent = question.chapterDescription;
    
    // 버튼 선택 상태 초기화
    resetButtonSelection();
}

/**
 * 챕터 번호 추출 (간단한 버전 - 필요시 수정)
 */
function getChapterNumber(chapterTitle) {
    // 챕터별 번호 매핑 (실제로는 DB에서 관리하거나 다른 방식으로 처리)
    const chapterMap = {
        '환율 (Exchange Rate)': 1,
        '금리 (Interest Rate)': 2,
        '인플레이션 (Inflation)': 3,
        '경제성장률 (GDP Growth)': 4,
        '경상수지 및 무역수지 (Balance of Trade)': 5,
        '정치적 안정성 및 지정학적 리스크 (Geopolitical Risk)': 6,
        '국가부채 및 재정 건전성 (Public Debt)': 7,
        '교역조건 (Terms of Trade)': 8,
        '외국인 투자자금 흐름 (Foreign Capital Flow)': 9,
        '글로벌 원자재 가격 (Commodity Prices)': 10,
        '산업별 수출입 및 유망 산업 분석 (Industrial Cycle)': 11
    };
    
    return chapterMap[chapterTitle] || 1;
}

/**
 * 진행 상황 업데이트
 * @param {number} index - 현재 질문 인덱스
 */
function updateProgress(index) {
    const currentNum = index + 1;
    const total = quizData.totalQuestions;
    
    const progress = (currentNum / total) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

/**
 * 답변 선택 함수
 * @param {string} answer - 선택한 답변 ('O' 또는 'X')
 */
function selectAnswer(answer) {
    const currentQuestion = quizData.questions[quizData.currentIndex];

    // 현재 문항 응답 시간(ms) 계산
    const now = Date.now();
    let responseTimeMs = 0;
    if (quizData.questionStartTime) {
        responseTimeMs = now - quizData.questionStartTime;
    }

    // 답변 저장
    quizData.answers[quizData.currentIndex] = {
        questionNum: currentQuestion.questionNum,
        userAnswer: answer,
        correctAnswer: currentQuestion.answer,
        isCorrect: answer === currentQuestion.answer,
        responseTimeMs: responseTimeMs
    };
    
    // 선택된 버튼 시각적 피드백
    if (answer === 'O') {
        document.getElementById('btn-o').classList.add('ring-4', 'ring-blue-300');
        document.getElementById('btn-x').classList.remove('ring-4', 'ring-red-300');
    } else {
        document.getElementById('btn-x').classList.add('ring-4', 'ring-red-300');
        document.getElementById('btn-o').classList.remove('ring-4', 'ring-blue-300');
    }
    
    // 다음 문제로 넘어가는 인터렉션
    setTimeout(() => {
        moveToNextQuestion();
    }, 500);
}

/**
 * 다음 문제로 이동
 */
function moveToNextQuestion() {
    const questionCard = document.getElementById('question-card');
    
    // 페이드 아웃 효과
    questionCard.classList.add('fade-out');
    
    setTimeout(() => {
        quizData.currentIndex++;
        
        if (quizData.currentIndex < quizData.totalQuestions) {
            // 다음 질문 표시
            displayQuestion(quizData.currentIndex);
            updateProgress(quizData.currentIndex);
            
            // 페이드 인 효과
            questionCard.classList.remove('fade-out');
            questionCard.classList.add('fade-in');
            
            setTimeout(() => {
                questionCard.classList.remove('fade-in');
            }, 300);
        } else {
            // 모든 문제 완료
            completeQuiz();
        }
    }, 300);
}

/**
 * 버튼 선택 상태 초기화
 */
function resetButtonSelection() {
    document.getElementById('btn-o').classList.remove('ring-4', 'ring-blue-300');
    document.getElementById('btn-x').classList.remove('ring-4', 'ring-red-300');
}

/**
 * 등급 계산
 * @param {number} score - 정답 개수 (0~56)
 * @returns {string} 등급 (S, A, B, C, D)
 */
function calculateGrade(score) {
    if (score >= 51) return 'S';
    if (score >= 45) return 'A';
    if (score >= 39) return 'B';
    if (score >= 28) return 'C';
    return 'D';
}

/**
 * 퀴즈 완료 처리
 */
async function completeQuiz() {
    // 정답 개수 계산
    const correctCount = quizData.answers.filter(answer => answer && answer.isCorrect).length;
    const totalCount = quizData.answers.filter(answer => !!answer).length;
    const score = Math.round((correctCount / totalCount) * 100);
    const grade = calculateGrade(correctCount);

    // 소요 시간 계산 (초 단위)
    const endTime = Date.now();
    const elapsedMs = quizData.startTime ? (endTime - quizData.startTime) : 0;
    const elapsedSeconds = Math.round(elapsedMs / 1000);
    
    // 결과 데이터 준비
    const resultData = {
        totalScore: correctCount,
        grade: grade,
        elapsedSeconds: elapsedSeconds, // 퀴즈 풀이 소요 시간(초)
        // 비어 있거나 세팅되지 않은 답변은 제외
        details: quizData.answers
            .filter(answer => !!answer)
            .map(answer => ({
                questionNum: answer.questionNum,
                userAnswer: answer.userAnswer,
                isCorrect: answer.isCorrect ? 1 : 0,
                responseTimeMs: answer.responseTimeMs || 0
            }))
    };
    
    try {
        // 서버로 결과 전송
        const response = await fetch('/test/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultData)
        });
        
        const result = await response.json();
        
        if (result.info && result.info.status === 'S') {
            // 성공 시 결과 페이지로 이동
            const data = Array.isArray(result.dataset.data) ? result.dataset.data[0] : result.dataset.data;
            const resultId = data ? data.resultId : null;
            if (resultId) {
                window.location.href = `/test/result/${resultId}`;
            } else {
                alert(
                    `퀴즈 완료!\n` +
                    `정답: ${correctCount}/${totalCount} (${score}%)\n` +
                    `등급: ${grade}\n` +
                    `소요 시간: ${elapsedSeconds}초`
                );
            }
        } else {
            alert('결과 저장 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('결과 저장 오류:', error);
        alert('결과 저장 중 오류가 발생했습니다.');
    }
}

// 전역 함수로 export (HTML에서 호출하기 위해)
window.selectAnswer = selectAnswer;
window.initQuiz = initQuiz;

