# 퀴즈 결과 데이터베이스 저장 구조

## 📊 저장 흐름

퀴즈 완료 시 데이터는 **2단계**로 저장됩니다:

1. **전체 결과 저장** (`test_results` 테이블)
2. **각 문제별 상세 결과 저장** (`test_details` 테이블)

---

## 1️⃣ 전체 결과 저장 (`test_results`)

### 저장 시점
- 사용자가 모든 문제를 완료하고 `completeQuiz()` 함수가 호출될 때

### 저장되는 데이터
```javascript
{
    userName: "USER_1",           // 자동 생성된 사용자 이름 (USER_N 형식)
    totalScore: 5,                // 정답 개수
    grade: null                   // 등급 (현재는 사용하지 않음)
}
```

### SQL 쿼리
```xml
<insert id="insertResult" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO test_results (user_name, total_score, grade)
    VALUES (#{userName}, #{totalScore}, #{grade})
</insert>
```

### 테이블 구조
- `id`: 결과 ID (Auto Increment, Primary Key)
- `user_name`: 사용자 이름 (USER_N 형식)
- `total_score`: 총 정답 개수
- `grade`: 등급 (현재는 null로 저장)
- `created_at`: 생성 시각 (자동)

### 반환값
- `insertId`: 새로 생성된 결과 ID (다음 단계에서 사용)

---

## 2️⃣ 각 문제별 상세 결과 저장 (`test_details`)

### 저장 시점
- 전체 결과 저장 후, 각 문제별로 **반복문을 통해 개별 저장**

### 저장되는 데이터 (각 문제마다)
```javascript
{
    resultId: 123,                // 위에서 생성된 test_results의 id
    questionNum: 1,               // 문제 번호
    userAnswer: "O",              // 사용자가 선택한 답변 ("O" 또는 "X")
    isCorrect: 1,                 // 정답 여부 (1: 정답, 0: 오답)
    responseTimeMs: 3500          // 해당 문제에 소요된 시간 (밀리초)
}
```

### SQL 쿼리
```xml
<insert id="insertDetail">
    INSERT INTO test_details (result_id, question_num, user_answer, is_correct, response_time_ms)
    VALUES (#{resultId}, #{questionNum}, #{userAnswer}, #{isCorrect}, #{responseTimeMs})
</insert>
```

### 테이블 구조
- `result_id`: 결과 ID (Foreign Key → test_results.id)
- `question_num`: 문제 번호
- `user_answer`: 사용자 답변 ("O" 또는 "X")
- `is_correct`: 정답 여부 (1: 정답, 0: 오답)
- `response_time_ms`: 응답 시간 (밀리초 단위)

### 저장 과정
```javascript
// 퀴즈 상세 결과 저장 (각 detail을 개별적으로 저장)
for (const detail of resultData.details || []) {
    // null/undefined 체크
    if (!detail || detail.questionNum == null) {
        continue;
    }

    await commonDao(mapper.TEST, 'insertDetail', {
        resultId: resultId,
        questionNum: detail.questionNum,
        userAnswer: detail.userAnswer,
        isCorrect: detail.isCorrect,
        responseTimeMs: detail.responseTimeMs || 0
    });
}
```

---

## 📝 실제 저장 예시

### 예: 5문제 퀴즈 완료 시

#### 1. `test_results` 테이블에 1건 저장
```
id: 1
user_name: "USER_1"
total_score: 3
grade: null
created_at: "2026-01-15 14:30:00"
```

#### 2. `test_details` 테이블에 5건 저장
```
result_id: 1, question_num: 1, user_answer: "O", is_correct: 1, response_time_ms: 2500
result_id: 1, question_num: 2, user_answer: "X", is_correct: 1, response_time_ms: 1800
result_id: 1, question_num: 3, user_answer: "O", is_correct: 0, response_time_ms: 3200
result_id: 1, question_num: 4, user_answer: "X", is_correct: 1, response_time_ms: 2100
result_id: 1, question_num: 5, user_answer: "O", is_correct: 0, response_time_ms: 2900
```

---

## 🔍 데이터 수집 정보

### 수집되는 메트릭
1. **전체 성과**
   - 총 정답 개수
   - 전체 소요 시간 (초 단위)

2. **문제별 상세 정보**
   - 각 문제의 정답/오답 여부
   - 각 문제별 응답 시간 (밀리초 단위)
   - 사용자가 선택한 답변

### 활용 가능한 분석
- 문제별 평균 응답 시간
- 정답률이 낮은 문제 파악
- 응답 시간과 정답률의 상관관계
- 사용자별 학습 패턴 분석

---

## 💡 참고사항

- **트랜잭션**: 현재는 각 INSERT가 개별적으로 실행되므로, 일부만 저장되고 실패할 수 있습니다. 필요시 트랜잭션 처리를 추가할 수 있습니다.
- **성능**: 문제가 많을 경우 여러 번의 INSERT가 발생하므로, 배치 INSERT로 최적화할 수 있습니다.
- **데이터 무결성**: `result_id`는 Foreign Key로 `test_results.id`를 참조합니다.
