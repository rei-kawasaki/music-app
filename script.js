let questions = {
    multipleChoice: [],
    freeResponse: [],
    audioResponse: [],
    sheetMusic: []
};
let currentIndex = {
    multipleChoice: 0,
    freeResponse: 0,
    audioResponse: 0,
    sheetMusic: 0
};
let correctAnswers = 0;
let totalQuestions = 0;
let startTime;


// 質問データのロード
function loadQuestions() {
    const questionTypes = ['multipleChoice', 'freeResponse', 'audioResponse', 'sheetMusic'];
    questionTypes.forEach(type => {
        questions[type] = fetchQuestions(`${type}Questions.json`);
    });
    totalQuestions = Object.values(questions).flat().length;
    startTime = new Date();
}

// 質問データのフェッチ
function fetchQuestions(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false); // 同期リクエスト
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        console.error(`Failed to fetch ${url}`);
        return [];
    }
}

// タブに対応する質問のロード
function loadQuestion(type) {
    switch(type){
        case 'multiple-choice':
            loadMultipleChoiceQuestion();
            break;
        case 'free-response':
            loadFreeResponseQuestion();
            break;
        case 'audio-response':
            loadAudioResponseQuestion();
            break;
        case 'sheet-music':
            loadSheetMusicQuestion();
            break;
        default:
            console.warn(`Unknown question type: ${type}`);
    }
}

// 各質問タイプのロード関数（具体的な実装を追加してください）
function loadMultipleChoiceQuestion() {
    if (currentIndex.multipleChoice < questions.multipleChoice.length) {
        const currentQuestion = questions.multipleChoice[currentIndex.multipleChoice];
        document.getElementById('questionText').innerText = currentQuestion.text;
        updateQuestionNumber(currentIndex.multipleChoice, questions.multipleChoice.length, 'currentQuestionNumber', 'totalQuestions');
        const options = document.getElementById('options');
        options.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary m-1';
            button.innerText = option;
            button.setAttribute('data-answer', option);
            button.onclick = () => checkMultipleChoiceAnswer(button);
            options.appendChild(button);
        });
    } else {
        showEndScreen();
    }
}

function checkMultipleChoiceAnswer(button) {
    const answer = button.getAttribute('data-answer');
    const currentQuestion = questions.multipleChoice[currentIndex.multipleChoice];
    if (!currentQuestion) {
        console.error('Current question is undefined');
        return;
    }
    const resultElement = document.getElementById('multipleChoiceResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextMultipleChoiceQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextMultipleChoiceQuestion() {
    currentIndex.multipleChoice++;
    loadMultipleChoiceQuestion();
}

// Free Response Quiz
function loadFreeResponseQuestion() {
    if (currentIndex.freeResponse < questions.freeResponse.length) {
        const currentQuestion = questions.freeResponse[currentIndex.freeResponse];
        loadQuestionContent(currentQuestion, 'freeResponseQuestion', 'freeResponseAnswer', 'freeResponseResult');
        updateQuestionNumber(currentIndex.freeResponse, questions.freeResponse.length, 'currentFreeResponseQuestionNumber', 'totalFreeResponseQuestions');
    } else {
        showEndScreen();
    }
}

function checkFreeResponseAnswer() {
    const answer = document.getElementById('freeResponseAnswer').value;
    const currentQuestion = questions.freeResponse[currentIndex.freeResponse];
    const resultElement = document.getElementById('freeResponseResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextFreeResponseQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextFreeResponseQuestion() {
    currentIndex.freeResponse++;
    loadFreeResponseQuestion();
}

// Audio Response Quiz
function loadAudioResponseQuestion() {
    if (currentIndex.audioResponse < questions.audioResponse.length) {
        const currentQuestion = questions.audioResponse[currentIndex.audioResponse];
        loadQuestionContent(currentQuestion, 'audioResponseQuestion', 'audioResponseAnswer', 'audioResponseResult');
        updateQuestionNumber(currentIndex.audioResponse, questions.audioResponse.length, 'currentAudioResponseQuestionNumber', 'totalAudioResponseQuestions');
    } else {
        showEndScreen();
    }
}

function checkAudioResponseAnswer() {
    const answer = document.getElementById('audioResponseAnswer').value;
    const currentQuestion = questions.audioResponse[currentIndex.audioResponse];
    const resultElement = document.getElementById('audioResponseResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextAudioResponseQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextAudioResponseQuestion() {
    currentIndex.audioResponse++;
    loadAudioResponseQuestion();
}

function playAudio() {
    const currentQuestion = questions.audioResponse[currentIndex.audioResponse];
    const audio = new Audio(currentQuestion.audio);
    audio.play();
}

// Sheet Music Quiz
function loadSheetMusicQuestion() {
    if (currentIndex.sheetMusic < questions.sheetMusic.length) {
        const currentQuestion = questions.sheetMusic[currentIndex.sheetMusic];
        loadQuestionContent(currentQuestion, 'sheetMusicQuestion', 'sheetMusicAnswer', 'sheetMusicResult');
        updateQuestionNumber(currentIndex.sheetMusic, questions.sheetMusic.length, 'currentSheetMusicQuestionNumber', 'totalSheetMusicQuestions');
        const sheetMusicImage = document.getElementById('sheetMusicImage');
        sheetMusicImage.src = currentQuestion.image;
    } else {
        showEndScreen();
    }
}

function checkSheetMusicAnswer() {
    const answer = document.getElementById('sheetMusicAnswer').value;
    const currentQuestion = questions.sheetMusic[currentIndex.sheetMusic];
    const resultElement = document.getElementById('sheetMusicResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextSheetMusicQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextSheetMusicQuestion() {
    currentIndex.sheetMusic++;
    loadSheetMusicQuestion();
}

// Common Functions
function checkAnswer(answer, correctAnswer, resultElement) {
    if (answer === correctAnswer) {
        resultElement.textContent = '正解！';
        resultElement.classList.add('text-success');
        resultElement.classList.remove('text-danger');
    } else {
        resultElement.textContent = '不正解';
        resultElement.classList.add('text-danger');
        resultElement.classList.remove('text-success');
    }
    setTimeout(() => {
        resultElement.textContent = '';
    }, 2000); // 2秒後に結果を消す
}

function showEndScreen() {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // 経過時間を秒単位で計算
    const resultText = `正解数: ${correctAnswers} / ${totalQuestions}<br>経過時間: ${timeTaken} 秒`;
    document.getElementById('quizResult').innerHTML = resultText;
    document.getElementById('quiz-end').style.display = 'block';
    document.getElementById('quiz-content').style.display = 'none';
}

loadQuestions();