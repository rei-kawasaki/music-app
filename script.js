let multipleChoiceQuestions = [];
let freeResponseQuestions = [];
let audioResponseQuestions = [];
let sheetMusicQuestions = [];
let currentMultipleChoiceIndex = 0;
let currentFreeResponseIndex = 0;
let currentAudioResponseIndex = 0;
let currentSheetMusicIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let startTime;

async function loadQuestions() {
    try {
        const multipleChoiceResponse = await fetch('multipleChoiceQuestions.json');
        multipleChoiceQuestions = await multipleChoiceResponse.json();
        const freeResponseResponse = await fetch('freeResponseQuestions.json');
        freeResponseQuestions = await freeResponseResponse.json();
        const audioResponseResponse = await fetch('audioResponseQuestions.json');
        audioResponseQuestions = await audioResponseResponse.json();
        const sheetMusicResponse = await fetch('sheetMusicQuestions.json');
        sheetMusicQuestions = await sheetMusicResponse.json();
        totalQuestions = multipleChoiceQuestions.length + freeResponseQuestions.length + audioResponseQuestions.length + sheetMusicQuestions.length;
        startTime = new Date();
        loadMultipleChoiceQuestion();
        loadFreeResponseQuestion();
        loadAudioResponseQuestion();
        loadSheetMusicQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function loadQuestion(question, questionTextId, answerFieldId = null, resultFieldId = null) {
    document.getElementById(questionTextId).textContent = question.question;
    if (answerFieldId) {
        document.getElementById(answerFieldId).value = ''; // フィールドをクリア
    }
    if (resultFieldId) {
        document.getElementById(resultFieldId).textContent = ''; // 結果をクリア
    }
}

function updateQuestionNumber(currentIndex, totalQuestions, currentNumberId, totalNumberId) {
    document.getElementById(currentNumberId).textContent = currentIndex + 1;
    document.getElementById(totalNumberId).textContent = totalQuestions;
}

// Multiple Choice Quiz
function loadMultipleChoiceQuestion() {
    if (currentMultipleChoiceIndex < multipleChoiceQuestions.length) {
        const currentQuestion = multipleChoiceQuestions[currentMultipleChoiceIndex];
        loadQuestion(currentQuestion, 'questionText');
        updateQuestionNumber(currentMultipleChoiceIndex, multipleChoiceQuestions.length, 'currentQuestionNumber', 'totalQuestions');
        const buttons = document.querySelectorAll('#options button');
        buttons.forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.setAttribute('data-answer', currentQuestion.options[index]);
        });
    } else {
        showEndScreen();
    }
}

function checkMultipleChoiceAnswer(button) {
    const answer = button.getAttribute('data-answer');
    const currentQuestion = multipleChoiceQuestions[currentMultipleChoiceIndex];
    const resultElement = document.getElementById('multipleChoiceResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextMultipleChoiceQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextMultipleChoiceQuestion() {
    currentMultipleChoiceIndex++;
    loadMultipleChoiceQuestion();
}

// Free Response Quiz
function loadFreeResponseQuestion() {
    if (currentFreeResponseIndex < freeResponseQuestions.length) {
        const currentQuestion = freeResponseQuestions[currentFreeResponseIndex];
        loadQuestion(currentQuestion, 'freeResponseQuestion', 'freeResponseAnswer', 'freeResponseResult');
        updateQuestionNumber(currentFreeResponseIndex, freeResponseQuestions.length, 'currentFreeResponseQuestionNumber', 'totalFreeResponseQuestions');
    } else {
        showEndScreen();
    }
}

function checkFreeResponseAnswer() {
    const answer = document.getElementById('freeResponseAnswer').value;
    const currentQuestion = freeResponseQuestions[currentFreeResponseIndex];
    const resultElement = document.getElementById('freeResponseResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextFreeResponseQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextFreeResponseQuestion() {
    currentFreeResponseIndex++;
    loadFreeResponseQuestion();
}

// Audio Response Quiz
function loadAudioResponseQuestion() {
    if (currentAudioResponseIndex < audioResponseQuestions.length) {
        const currentQuestion = audioResponseQuestions[currentAudioResponseIndex];
        loadQuestion(currentQuestion, 'audioResponseQuestion', 'audioResponseAnswer', 'audioResponseResult');
        updateQuestionNumber(currentAudioResponseIndex, audioResponseQuestions.length, 'currentAudioResponseQuestionNumber', 'totalAudioResponseQuestions');
    } else {
        showEndScreen();
    }
}

function checkAudioResponseAnswer() {
    const answer = document.getElementById('audioResponseAnswer').value;
    const currentQuestion = audioResponseQuestions[currentAudioResponseIndex];
    const resultElement = document.getElementById('audioResponseResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextAudioResponseQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextAudioResponseQuestion() {
    currentAudioResponseIndex++;
    loadAudioResponseQuestion();
}

function playAudio() {
    const currentQuestion = audioResponseQuestions[currentAudioResponseIndex];
    const audio = new Audio(currentQuestion.audio);
    audio.play();
}

// Sheet Music Quiz
function loadSheetMusicQuestion() {
    if (currentSheetMusicIndex < sheetMusicQuestions.length) {
        const currentQuestion = sheetMusicQuestions[currentSheetMusicIndex];
        loadQuestion(currentQuestion, 'sheetMusicQuestion', 'sheetMusicAnswer', 'sheetMusicResult');
        updateQuestionNumber(currentSheetMusicIndex, sheetMusicQuestions.length, 'currentSheetMusicQuestionNumber', 'totalSheetMusicQuestions');
        const sheetMusicImage = document.getElementById('sheetMusicImage');
        sheetMusicImage.src = currentQuestion.image;
    } else {
        showEndScreen();
    }
}

function checkSheetMusicAnswer() {
    const answer = document.getElementById('sheetMusicAnswer').value;
    const currentQuestion = sheetMusicQuestions[currentSheetMusicIndex];
    const resultElement = document.getElementById('sheetMusicResult');
    checkAnswer(answer, currentQuestion.correctAnswer, resultElement);
    setTimeout(nextSheetMusicQuestion, 2000); // 2秒後に次の質問に遷移
}

function nextSheetMusicQuestion() {
    currentSheetMusicIndex++;
    loadSheetMusicQuestion();
}

// Common Functions
function checkAnswer(answer, correctAnswer, resultElement) {
    if (answer === correctAnswer) {
        resultElement.textContent = '正解です！';
        resultElement.style.color = 'green';
        correctAnswers++;
    } else {
        resultElement.textContent = '不正解です。';
        resultElement.style.color = 'red';
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
}

// 初期の質問をロード
loadQuestions();