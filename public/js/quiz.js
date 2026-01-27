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
    questionStartTime: null, // 현재 문항 시작 시각
    chapterId: null // 현재 챕터 ID
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

    // 정답 여부 확인
    const isCorrect = answer === currentQuestion.answer;

    // 답변 저장
    quizData.answers[quizData.currentIndex] = {
        questionNum: currentQuestion.questionNum,
        userAnswer: answer,
        correctAnswer: currentQuestion.answer,
        isCorrect: isCorrect,
        responseTimeMs: responseTimeMs
    };
    
    // 버튼 비활성화 (중복 클릭 방지)
    document.getElementById('btn-o').disabled = true;
    document.getElementById('btn-x').disabled = true;
    
    // 즉시 피드백 표시
    if (isCorrect) {
        // 정답: 초록색 체크 표시
        showCorrectFeedback(answer);
        // 500ms 후 자동으로 다음 문제로 이동
        setTimeout(() => {
            moveToNextQuestion();
        }, 500);
    } else {
        // 오답: 빨간색 X 표시 및 오답 모달 표시
        showIncorrectFeedback(answer, currentQuestion.answer);
    }
}

/**
 * 정답 피드백 표시
 * @param {string} selectedAnswer - 선택한 답변
 */
function showCorrectFeedback(selectedAnswer) {
    const selectedButton = selectedAnswer === 'O' ? document.getElementById('btn-o') : document.getElementById('btn-x');
    
    // 초록색 체크 표시
    selectedButton.classList.remove('bg-blue-500', 'bg-red-500', 'hover:bg-blue-600', 'hover:bg-red-600');
    selectedButton.classList.add('bg-green-500');
    selectedButton.innerHTML = `
        <span class="text-2xl font-bold">✓</span>
        <span>정답입니다!</span>
    `;
}

/**
 * 오답 피드백 표시
 * @param {string} selectedAnswer - 선택한 답변
 * @param {string} correctAnswer - 정답
 */
function showIncorrectFeedback(selectedAnswer, correctAnswer) {
    const selectedButton = selectedAnswer === 'O' ? document.getElementById('btn-o') : document.getElementById('btn-x');
    
    // 빨간색 X 표시
    selectedButton.classList.remove('bg-blue-500', 'bg-red-500', 'hover:bg-blue-600', 'hover:bg-red-600');
    selectedButton.classList.add('bg-red-600');
    selectedButton.innerHTML = `
        <span class="text-2xl font-bold">✗</span>
        <span>오답입니다</span>
    `;
    
    // 오답 모달 표시
    showWrongAnswerModal(correctAnswer);
}

/**
 * 오답 모달 표시
 * @param {string} correctAnswer - 정답
 */
function showWrongAnswerModal(correctAnswer) {
    const modal = document.getElementById('wrong-answer-modal');
    const correctAnswerText = document.getElementById('correct-answer-text');
    
    correctAnswerText.textContent = `정답: ${correctAnswer === 'O' ? 'O (정답)' : 'X (오답)'}`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

/**
 * 오답 모달 닫기 및 다음 문제로 이동
 */
function closeWrongAnswerModal() {
    const modal = document.getElementById('wrong-answer-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    // 다음 문제로 이동
    moveToNextQuestion();
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
    const btnO = document.getElementById('btn-o');
    const btnX = document.getElementById('btn-x');
    
    // 모든 스타일 초기화
    btnO.classList.remove('ring-4', 'ring-blue-300', 'bg-green-500', 'bg-red-600');
    btnX.classList.remove('ring-4', 'ring-red-300', 'bg-green-500', 'bg-red-600');
    
    // 원래 색상으로 복원
    btnO.classList.add('bg-blue-500', 'hover:bg-blue-600');
    btnX.classList.add('bg-red-500', 'hover:bg-red-600');
    
    // 버튼 활성화
    btnO.disabled = false;
    btnX.disabled = false;
    
    // 원래 텍스트로 복원
    btnO.innerHTML = `
        <span class="text-2xl font-bold">O</span>
        <span>정답</span>
    `;
    btnX.innerHTML = `
        <span class="text-2xl font-bold">X</span>
        <span>오답</span>
    `;
}

/**
 * 등급 계산 (챕터별 문제 수에 따라 비율로 계산)
 * @param {number} score - 정답 개수
 * @param {number} total - 전체 문제 수
 * @returns {string} 등급 (S, A, B, C, D)
 */
function calculateGrade(score, total) {
    const percentage = (score / total) * 100;
    
    // 비율 기반 등급 계산
    if (percentage >= 90) return 'S';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
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

    // 소요 시간 계산 (초 단위)
    const endTime = Date.now();
    const elapsedMs = quizData.startTime ? (endTime - quizData.startTime) : 0;
    const elapsedSeconds = Math.round(elapsedMs / 1000);
    
    // 결과 데이터 준비
    const resultData = {
        totalScore: correctCount,
        elapsedSeconds: elapsedSeconds,
        chapterId: quizData.chapterId, // 챕터 ID 추가
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
        // 서버로 결과 전송 (백그라운드에서 저장만)
        const response = await fetch('/test/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultData)
        });
        
        const result = await response.json();
        
        if (result.info && result.info.status === 'S') {
            // 완료 모달 표시 (결과 페이지로 이동하지 않음)
            showCompletionModal(correctCount, totalCount, score, elapsedSeconds);
        } else {
            // 저장 실패해도 완료 모달은 표시
            showCompletionModal(correctCount, totalCount, score, elapsedSeconds);
            console.error('결과 저장 실패:', result);
        }
    } catch (error) {
        console.error('결과 저장 오류:', error);
        // 네트워크 오류 등으로 저장 실패해도 완료 모달은 표시
        showCompletionModal(correctCount, totalCount, score, elapsedSeconds);
    }
}

/**
 * 완료 모달 표시
 */
function showCompletionModal(correctCount, totalCount, score, elapsedSeconds) {
    const modal = document.getElementById('completion-modal');
    const correctCountEl = document.getElementById('completion-correct-count');
    const totalCountEl = document.getElementById('completion-total-count');
    const scoreEl = document.getElementById('completion-score');
    const timeEl = document.getElementById('completion-time');
    
    correctCountEl.textContent = correctCount;
    totalCountEl.textContent = totalCount;
    scoreEl.textContent = score;
    timeEl.textContent = `소요시간 ${elapsedSeconds}초`;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

/**
 * 완료 모달 닫기 및 챕터 선택으로 돌아가기
 */
function closeCompletionModal() {
    const modal = document.getElementById('completion-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    // 챕터 선택 화면으로 이동
    window.location.href = '/test/chapters';
}

// 전역 함수로 export (HTML에서 호출하기 위해)
window.selectAnswer = selectAnswer;
window.initQuiz = initQuiz;
window.closeWrongAnswerModal = closeWrongAnswerModal;
window.closeCompletionModal = closeCompletionModal;

