        let quizData = null;
        let selectedChoice = null;

        // 初期化処理
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                await initQuiz();
                setupEventListeners();
            } catch (error) {
                console.error('初期化に失敗:', error);
            }
        });

        // クイズデータの取得
        async function initQuiz() {
            const response = await fetch('quiz-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            quizData = await response.json();
            displayAllQuizzes();
        }

        // イベントリスナーの設定
        function setupEventListeners() {
            // 各クイズタイプの送信ボタンに対する処理
            document.querySelectorAll('[id^="quiz-submit"]').forEach(button => {
                if (!button.dataset.listenerAdded) {
                    button.addEventListener('click', () => submitAnswer(button.id.replace('quiz-submit-', '')));
                    button.dataset.listenerAdded = 'true';
                }
            });
        }

        // 全てのクイズを表示
        function displayAllQuizzes() {
            ['multiple', 'free', 'audio', 'sheet'].forEach(displayQuiz);
        }

        // 各クイズの表示処理
        function displayQuiz(type) {
            if (!quizData?.[type]) return;

            const quizzes = quizData[type];
            const container = document.getElementById(`quiz-content-${type}`);
            if (!container) return;

            container.innerHTML = ''; // 既存のクイズをクリア

            const section = document.createElement('section');
            section.className = 'quiz-container mb-4';
            section.style.maxWidth = '100%';
            quizzes.forEach((quiz, index) => {

            const questionElement = document.createElement('p');
            questionElement.id = `quiz-question-${type}-${index}`;
            questionElement.className = 'mb-4';
            questionElement.textContent = quiz.question;
            section.appendChild(questionElement);

            if (type === 'multiple') {
                // 4択クイズの選択肢を表示
                const choicesDiv = document.createElement('div');
                choicesDiv.id = `quiz-choices-${type}-${index}`;
                choicesDiv.className = 'mb-4';
                quiz.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary btn-sm me-2';
                button.textContent = choice;
                // 選択肢がクリックされたときの処理を追加
                button.addEventListener('click', () => handleChoiceSelection(button, choice));
                choicesDiv.appendChild(button);
                });
                section.appendChild(choicesDiv);
            } else if (type === 'audio') {
                // 音声クイズの再生ボタンを表示
                const playButton = document.createElement('button');
                playButton.className = 'quiz-play-audio btn btn-secondary mb-4';
                playButton.innerHTML = '<i class="bi bi-play-fill me-2"></i>音を再生';
                playButton.dataset.audioFile = quiz.audioFile;
                // 再生ボタンがクリックされたときの処理を追加
                playButton.addEventListener('click', playAudio);
                section.appendChild(playButton);

                // 音声クイズの回答入力欄を表示
                const answerInput = document.createElement('input');
                answerInput.type = 'text';
                answerInput.className = 'form-control mb-4 w-50';
                answerInput.id = `quiz-answer-${type}-${index}`;
                answerInput.placeholder = '音階を入力してください';
                section.appendChild(answerInput);
            } else if (type === 'free') {
                const answerInput = document.createElement('input');
                answerInput.type = 'text';
                answerInput.className = 'form-control mb-4 w-50';
                answerInput.id = `quiz-answer-${type}-${index}`;
                answerInput.placeholder = '音階を入力してください';
                section.appendChild(answerInput);
            } else if (type === 'sheet') {
                const image = document.createElement('img');
                image.id = `quiz-image-${type}-${index}`;
                image.className = 'img-fluid mb-4';
                image.src = quiz.imageFile;
                image.alt = '楽譜';
                section.appendChild(image);

                const answerInput = document.createElement('input');
                answerInput.type = 'text';
                answerInput.className = 'form-control mb-4 w-50';
                answerInput.id = `quiz-answer-${type}-${index}`;
                answerInput.placeholder = '楽譜を読み取って入力してください';
                section.appendChild(answerInput);
            } else {
                const answerInput = document.createElement('input');
                answerInput.type = 'text';
                answerInput.className = 'form-control mb-2 w-50';
                answerInput.id = `quiz-answer-${type}-${index}`;
                answerInput.placeholder = '回答を入力してください';
                section.appendChild(answerInput);
            }

            });

            const submitButton = document.createElement('button');
            submitButton.className = 'btn btn-primary';
            submitButton.id = `quiz-submit-${type}`;
            submitButton.textContent = '回答する';
            if (!submitButton.dataset.listenerAdded) {
                submitButton.addEventListener('click', () => submitAnswer(type));
                submitButton.dataset.listenerAdded = 'true';
            }
            section.appendChild(submitButton);

            container.appendChild(section);
        }

        // 選択肢が選ばれた際の処理
        function handleChoiceSelection(button, choice) {
            const index = button.parentElement.id.split('-').pop();
            document.querySelectorAll(`#quiz-choices-multiple-${index} button`).forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('btn-outline-primary');
            btn.classList.remove('btn-primary');
            });
            button.classList.add('active');
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
            selectedChoice = choice;
        }

        // 回答を提出
        function submitAnswer(type) {
            const quizElements = document.querySelectorAll(`[id^="quiz-question-${type}-"]`);
            let correctCount = 0;
            let totalCount = quizElements.length;

            quizElements.forEach((quizElement, index) => {
                const quiz = quizData[type][index];
                let isCorrect = false;
                let userAnswer;

                if (type === 'multiple') {
                    isCorrect = selectedChoice === quiz.answer;
                } else {
                    // 自由記述、音階、楽譜の場合
                    const answerElement = document.getElementById(`quiz-answer-${type}-${index}`);
                    if (answerElement) {
                        userAnswer = answerElement.value.trim();
                        isCorrect = userAnswer === quiz.answer;
                    }
                }

                if (isCorrect) {
                    correctCount++;
                }
            });

            // 結果を表示
            alert(`正解数: ${correctCount} / ${totalCount}`);
        }

    // 音声を再生する関数
    function playAudio(event) {
        const audioFile = event.target.dataset.audioFile;
        if (audioFile) {
            const audio = new Audio(audioFile);
            audio.play();
        } else {
            console.error('Audio file not found.');
        }
    }