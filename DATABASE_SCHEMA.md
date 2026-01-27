# 투자 퀴즈 시스템 데이터베이스 스키마

## 📊 데이터베이스 개요

- **데이터베이스명**: `invest_dev`
- **DBMS**: MySQL
- **인코딩**: UTF-8

---

## 📋 테이블 목록

1. `chapters` - 챕터 정보
2. `questions` - 문제 정보
3. `test_results` - 퀴즈 결과
4. `test_details` - 문항별 상세 결과

---

## 🗂️ 테이블 상세 구조

### 1. `chapters` (챕터 테이블)

**설명**: 퀴즈의 챕터(단원) 정보를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|------------|---------|------|
| `id` | INT | PK, AUTO_INCREMENT, NOT NULL | 챕터 ID (기본키) |
| `title` | VARCHAR(255) | NOT NULL | 챕터 제목 |
| `description` | TEXT | NULL | 챕터 설명 |

**인덱스**:
- PRIMARY KEY (`id`)

**예시 데이터**:
```
id | title                                    | description
---|------------------------------------------|------------------------------------------
1  | 환율 (Exchange Rate)                     | 경제의 온도를 조절하는 '돈의 가격'입니다
2  | 금리 (Interest Rate)                     | 자금의 가격을 결정하는 핵심 지표입니다
...
```

---

### 2. `questions` (문제 테이블)

**설명**: 각 챕터별 문제 정보를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|------------|---------|------|
| `id` | INT | PK, AUTO_INCREMENT, NOT NULL | 문제 ID (기본키) |
| `question_num` | INT | NOT NULL | 문제 번호 |
| `content` | TEXT | NOT NULL | 문제 내용 |
| `answer` | VARCHAR(1) | NOT NULL | 정답 ("O" 또는 "X") |
| `chapter_id` | INT | FK, NOT NULL | 챕터 ID (외래키 → chapters.id) |

**인덱스**:
- PRIMARY KEY (`id`)
- FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`)

**제약조건**:
- `answer`는 'O' 또는 'X'만 허용

**예시 데이터**:
```
id | question_num | content                                    | answer | chapter_id
---|--------------|--------------------------------------------|--------|------------
1  | 1            | 원/달러 환율이 상승하면...                  | O      | 1
2  | 2            | 환율 하락은 수출 경쟁력 향상...            | X      | 1
...
```

---

### 3. `test_results` (퀴즈 결과 테이블)

**설명**: 사용자가 완료한 퀴즈의 전체 결과를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|------------|---------|------|
| `id` | INT | PK, AUTO_INCREMENT, NOT NULL | 결과 ID (기본키) |
| `user_name` | VARCHAR(50) | NOT NULL | 사용자 이름 (USER_N 형식) |
| `total_score` | INT | NOT NULL | 총 정답 개수 |
| `chapter_id` | INT | FK, NOT NULL | 챕터 ID (외래키 → chapters.id) |
| `grade` | VARCHAR(10) | NOT NULL | 등급 (현재는 빈 문자열로 저장, 사용하지 않음) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시각 |

**인덱스**:
- PRIMARY KEY (`id`)
- FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`)

**특이사항**:
- `user_name`은 자동으로 `USER_1`, `USER_2`, ... 형식으로 생성됨
- `grade` 컬럼은 현재 사용하지 않음 (빈 문자열로 저장)

**예시 데이터**:
```
id | user_name | total_score | chapter_id | grade | created_at
---|-----------|-------------|------------|-------|--------------------
1  | USER_1    | 5           | 1          |       | 2026-01-15 10:30:00
2  | USER_2    | 3           | 1          |       | 2026-01-15 11:15:00
...
```

---

### 4. `test_details` (문항별 상세 결과 테이블)

**설명**: 퀴즈 결과의 각 문제별 상세 정보를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|------------|---------|------|
| `result_id` | INT | FK, NOT NULL | 결과 ID (외래키 → test_results.id) |
| `question_num` | INT | NOT NULL | 문제 번호 |
| `user_answer` | VARCHAR(1) | NOT NULL | 사용자가 선택한 답변 ("O" 또는 "X") |
| `is_correct` | TINYINT(1) | NOT NULL | 정답 여부 (1: 정답, 0: 오답) |
| `response_time_ms` | INT | NOT NULL, DEFAULT 0 | 해당 문제에 소요된 응답 시간 (밀리초) |

**인덱스**:
- PRIMARY KEY (`result_id`, `question_num`) - 복합 기본키
- FOREIGN KEY (`result_id`) REFERENCES `test_results`(`id`) ON DELETE CASCADE

**제약조건**:
- `user_answer`는 'O' 또는 'X'만 허용
- `is_correct`는 0 또는 1만 허용

**예시 데이터**:
```
result_id | question_num | user_answer | is_correct | response_time_ms
----------|--------------|-------------|------------|-----------------
1         | 1            | O           | 1          | 2500
1         | 2            | X           | 1          | 1800
1         | 3            | O           | 0          | 3200
1         | 4            | X           | 1          | 2100
1         | 5            | O           | 0          | 2900
...
```

---

## 🔗 테이블 관계도 (ERD)

```
chapters (1) ────────────< (N) questions
   │                           │
   │                           │
   │                           │
   │ (1)                       │
   │                           │
   │                           │
   └───────────< (N) test_results (1) ────< (N) test_details
```

**관계 설명**:
- `chapters` 1 : N `questions` (한 챕터에 여러 문제)
- `chapters` 1 : N `test_results` (한 챕터에 여러 결과)
- `test_results` 1 : N `test_details` (한 결과에 여러 상세 결과)

---

## 📝 주요 쿼리 예시

### 1. 챕터 목록 조회 (문제 수 포함)
```sql
SELECT 
    c.id,
    c.title AS chapter_title,
    c.description AS chapter_description,
    COUNT(q.id) AS question_count
FROM chapters c
LEFT JOIN questions q ON c.id = q.chapter_id
GROUP BY c.id, c.title, c.description
ORDER BY c.id ASC;
```

### 2. 특정 챕터의 문제 조회
```sql
SELECT 
    q.question_num, 
    q.content, 
    q.answer, 
    c.title AS chapter_title, 
    c.description AS chapter_description
FROM questions q
JOIN chapters c ON q.chapter_id = c.id
WHERE c.id = ?
ORDER BY q.question_num ASC;
```

### 3. 퀴즈 결과 저장
```sql
INSERT INTO test_results (user_name, total_score, chapter_id, grade)
VALUES (?, ?, ?, '');
```

### 4. 문항별 상세 결과 저장
```sql
INSERT INTO test_details (result_id, question_num, user_answer, is_correct, response_time_ms)
VALUES (?, ?, ?, ?, ?);
```

### 5. 마지막 유저 번호 조회
```sql
SELECT COALESCE(MAX(CAST(SUBSTRING(user_name, 6) AS UNSIGNED)), 0) AS last_number
FROM test_results
WHERE user_name LIKE 'USER_%';
```

---

## 🔍 데이터 저장 프로세스

### 퀴즈 완료 시 데이터 저장 순서

1. **마지막 유저 번호 조회** (`getLastUserNumber`)
   - `test_results` 테이블에서 `USER_` 접두사가 붙은 마지막 번호 조회
   - 다음 번호 계산 (예: 마지막이 `USER_5`이면 다음은 `USER_6`)

2. **전체 결과 저장** (`insertResult`)
   - `test_results` 테이블에 한 건 INSERT
   - 생성된 `id`를 반환받음 (`resultId`)

3. **각 문제별 상세 결과 저장** (`insertDetail`)
   - 반복문을 통해 각 문제마다 `test_details` 테이블에 INSERT
   - `resultId`를 외래키로 사용하여 연결

**데이터 저장 예시**:
```
[전체 결과] test_results
id: 100, user_name: "USER_10", total_score: 5, chapter_id: 1

[상세 결과] test_details (5건)
result_id: 100, question_num: 1, user_answer: "O", is_correct: 1, response_time_ms: 2500
result_id: 100, question_num: 2, user_answer: "X", is_correct: 1, response_time_ms: 1800
result_id: 100, question_num: 3, user_answer: "O", is_correct: 0, response_time_ms: 3200
result_id: 100, question_num: 4, user_answer: "X", is_correct: 1, response_time_ms: 2100
result_id: 100, question_num: 5, user_answer: "O", is_correct: 0, response_time_ms: 2900
```

---

## 💡 데이터 분석 가능 항목

### 1. 챕터별 성과 분석
- 챕터별 평균 정답률
- 챕터별 평균 소요 시간
- 챕터별 참여자 수

### 2. 문제별 난이도 분석
- 문제별 정답률 (is_correct = 1인 비율)
- 문제별 평균 응답 시간
- 오답이 많은 문제 파악

### 3. 사용자 행동 분석
- 평균 응답 시간
- 응답 시간과 정답률의 상관관계
- 챕터별 학습 패턴

### 4. 성능 지표
- 전체 평균 정답률
- 전체 평균 소요 시간
- 시간대별 퀴즈 참여 통계

---

## 📌 주의사항

1. **외래키 제약조건**
   - `test_details`의 `result_id`는 `ON DELETE CASCADE`로 설정되어 있음
   - `test_results`의 레코드가 삭제되면 관련 `test_details`도 자동 삭제됨

2. **사용자 이름 생성**
   - `user_name`은 `USER_` + 숫자 형식으로 자동 생성
   - 마지막 번호 조회 시 문자열 파싱을 통해 숫자 부분 추출

3. **시간 단위**
   - `response_time_ms`는 밀리초 단위로 저장
   - 프론트엔드에서 계산된 값을 그대로 저장

4. **등급 컬럼**
   - `grade` 컬럼은 현재 사용하지 않음
   - 빈 문자열('')로 저장되며, 향후 확장 가능성을 위해 유지

---

## 🔧 DDL (Data Definition Language) 예시

```sql
-- chapters 테이블 생성
CREATE TABLE chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- questions 테이블 생성
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_num INT NOT NULL,
    content TEXT NOT NULL,
    answer VARCHAR(1) NOT NULL CHECK (answer IN ('O', 'X')),
    chapter_id INT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- test_results 테이블 생성
CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    total_score INT NOT NULL,
    chapter_id INT NOT NULL,
    grade VARCHAR(10) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- test_details 테이블 생성
CREATE TABLE test_details (
    result_id INT NOT NULL,
    question_num INT NOT NULL,
    user_answer VARCHAR(1) NOT NULL CHECK (user_answer IN ('O', 'X')),
    is_correct TINYINT(1) NOT NULL CHECK (is_correct IN (0, 1)),
    response_time_ms INT NOT NULL DEFAULT 0,
    PRIMARY KEY (result_id, question_num),
    FOREIGN KEY (result_id) REFERENCES test_results(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
