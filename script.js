let quizData = null;
let selectedChoice = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initQuiz();
        setupEventListeners();
    } catch (error) {
        console.error('初期化に失敗:', error);
    }
});

async function initQuiz() {
    const response = await fetch('quiz-data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    quizData = await response.json();
    displayAllQuizzes();
}

function setupEventListeners() {
    // クイズ送信ボタンのイベントリスナー
    document.getElementById('quiz-submit-multiple').addEventListener('click', () => submitAnswer('multiple'));
    document.getElementById('quiz-submit-free').addEventListener('click', () => submitAnswer('free'));
    document.getElementById('quiz-submit-audio').addEventListener('click', () => submitAnswer('audio'));
    document.getElementById('quiz-submit-sheet').addEventListener('click', () => submitAnswer('sheet'));
    
    // 音声再生ボタンのイベントリスナー
    document.getElementById('quiz-play-audio').addEventListener('click', playAudio);
}

function displayAllQuizzes() {
    ['multiple', 'free', 'audio', 'sheet'].forEach(type => {
        try {
            displayQuiz(type);
        } catch (error) {
            console.error(`${type}クイズの表示に失敗:`, error);
        }
    });
}

function displayQuiz(type) {
    if (!quizData?.[type]?.[0]) return;

    const quiz = quizData[type][0];
    const questionElement = document.getElementById(`quiz-question-${type}`);
    if (!questionElement) return;

    questionElement.textContent = quiz.question;
    
    if (type === 'multiple') {
        const choicesDiv = document.getElementById(`quiz-choices-${type}`);
        if (!choicesDiv) return;
        
        choicesDiv.innerHTML = '';
        quiz.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary mb-2';
            button.textContent = choice;
            button.addEventListener('click', () => handleChoiceSelection(button, index));
            choicesDiv.appendChild(button);
        });
    } else {
        if (type === 'audio') {
            const audioBtn = document.getElementById('quiz-play-audio');
            audioBtn.dataset.audioFile = quiz.audioFile;
        } else if (type === 'sheet') {
            document.getElementById('quiz-image-sheet').src = quiz.imageFile;
        }
    }
}

function handleChoiceSelection(button, index) {
    document.querySelectorAll('#quiz-choices-multiple button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    selectedChoice = index;
}

function submitAnswer(type) {
    const quiz = quizData[type][0];
    let answer;
    let isCorrect = false;
    
    switch(type) {
        case 'multiple':
            isCorrect = selectedChoice === quiz.answer;
            break;
            
        case 'free':
            answer = document.getElementById('free-answer').value.trim();
            isCorrect = answer === quiz.answer;
            break;
            
        case 'audio':
            answer = document.getElementById('audio-answer').value.trim();
            isCorrect = answer === quiz.answer;
            break;
            
        case 'sheet':
            answer = document.getElementById('sheet-answer').value.trim();
            isCorrect = answer === quiz.answer;
            break;
    }
    
    alert(isCorrect ? '正解です！' : '不正解です。もう一度試してください。');
}

function playAudio() {
    const audioBtn = document.querySelector('#audio button');
    const audio = new Audio(audioBtn.dataset.audioFile);
    audio.play();
}