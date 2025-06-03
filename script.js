const dinosaur = document.getElementById('dinosaur');
const gameContainer = document.getElementById('game-container');
const obstaclesContainer = document.getElementById('obstacles-container');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let isJumping = false;
let score = 0;
let gameOver = false;
let obstacleInterval;
let gameSpeed = 3000; // رکاوٹ کی اینیمیشن کا دورانیہ (میلی سیکنڈ)

// --- گیم شروع کرنے اور ری سیٹ کرنے کا فنکشن ---
function initializeGame() {
    isJumping = false;
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = 'اسکور: 0';
    gameOverScreen.classList.add('hidden'); // گیم اوور اسکرین چھپائیں

    // موجودہ رکاوٹیں ہٹائیں
    obstaclesContainer.innerHTML = ''; 

    // ڈائنوسار کی دوڑنے کی اینیمیشن شروع کریں
    dinosaur.classList.add('dino-run');

    // رکاوٹیں پیدا کرنے کا وقفہ شروع کریں
    startObstacleGeneration();
    // ٹکر کی جانچ کا وقفہ شروع کریں
    startGameLoop();
}

// --- ڈائنوسار کو جمپ کرانے کا فنکشن ---
function jump() {
    if (gameOver || isJumping) return; // اگر گیم اوور ہے یا پہلے سے جمپ کر رہا ہے تو کچھ نہ کریں
    isJumping = true;
    
    // ڈائنوسار کی جمپ اینیمیشن کی تصویر لگائیں
    dinosaur.classList.remove('dino-run');
    dinosaur.classList.add('dino-jump');

    dinosaur.classList.add('jump'); // CSS جمپ اینیمیشن شامل کریں

    setTimeout(() => {
        dinosaur.classList.remove('jump'); // جمپ اینیمیشن ختم ہونے پر ہٹا دیں
        dinosaur.classList.remove('dino-jump'); // جمپ کی تصویر ہٹا دیں
        if (!gameOver) { // اگر گیم اوور نہیں ہوا تو دوڑنے کی اینیمیشن دوبارہ شروع کریں
            dinosaur.classList.add('dino-run');
        }
        isJumping = false;
    }, 600); // 0.6 سیکنڈ بعد ہٹائیں (CSS اینیمیشن کی مدت)
}

// --- رکاوٹیں بنانے کا فنکشن ---
function createObstacle() {
    if (gameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    // بے ترتیب رکاوٹ کی قسم کا انتخاب کریں (درخت یا پتھر)
    const randomObstacleType = Math.random() < 0.5 ? 'obstacle-tree' : 'obstacle-rock';
    obstacle.classList.add(randomObstacleType);

    // رکاوٹ کی اینیمیشن کو متحرک طور پر سیٹ کریں
    obstacle.style.animationDuration = `${gameSpeed / 1000}s`;

    obstaclesContainer.appendChild(obstacle);

    // جب رکاوٹ اسکرین سے باہر نکل جائے تو اسے ہٹا دیں اور اسکور بڑھائیں
    obstacle.addEventListener('animationend', () => {
        if (!gameOver) {
            obstacle.remove();
            score++;
            scoreDisplay.textContent = `اسکور: ${score}`;
        }
    });
}

// --- رکاوٹیں مسلسل بنانے کا فنکشن ---
function startObstacleGeneration() {
    // پچھلے وقفے کو صاف کریں اگر کوئی ہے
    if (obstacleInterval) clearInterval(obstacleInterval);
    
    // ہر 1.5 سے 2.5 سیکنڈ کے درمیان ایک نئی رکاوٹ بنائیں
    obstacleInterval = setInterval(createObstacle, Math.random() * (2500 - 1500) + 1500);
}

// --- گیم لوپ اور ٹکر کی جانچ ---
let gameLoopInterval;
function startGameLoop() {
    if (gameLoopInterval) clearInterval(gameLoopInterval); // پچھلے لوپ کو صاف کریں
    
    gameLoopInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(gameLoopInterval);
            return;
        }

        const dinosaurRect = dinosaur.getBoundingClientRect();
        const gameContainerRect = gameContainer.getBoundingClientRect();

        const currentObstacles = document.querySelectorAll('.obstacle');

        currentObstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();

            // ٹکر کی جانچ
            // یہ ایک بہت بنیادی ٹکر کی جانچ ہے۔
            // اگر ڈائنوسار اور رکاوٹ کے Rectangles ایک دوسرے کو اوورلیپ کرتے ہیں
            if (
                dinosaurRect.left < obstacleRect.right &&
                dinosaurRect.right > obstacleRect.left &&
                dinosaurRect.top < obstacleRect.bottom &&
                dinosaurRect.bottom > obstacleRect.top
            ) {
                endGame();
            }
        });
    }, 10); // ہر 10 ملی سیکنڈ میں چیک کریں
}

// --- گیم ختم کرنے کا فنکشن ---
function endGame() {
    gameOver = true;
    clearInterval(obstacleInterval); // رکاوٹیں بنانا بند کریں
    clearInterval(gameLoopInterval); // گیم لوپ بند کریں

    // ڈائنوسار کی دوڑنے کی اینیمیشن روک دیں
    dinosaur.classList.remove('dino-run');
    
    // تمام چلتی ہوئی رکاوٹوں کو روک دیں تاکہ وہ اپنی جگہ پر ٹھہر جائیں
    document.querySelectorAll('.obstacle').forEach(obs => {
        obs.style.animationPlayState = 'paused';
    });
    
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.remove('hidden'); // گیم اوور اسکرین دکھائیں
}

// --- ایونٹ لسنر ---
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') { // Spacebar یا Up Arrow پر جمپ
        jump();
    }
});

gameContainer.addEventListener('touchstart', jump); // موبائل ٹچ پر جمپ

restartButton.addEventListener('click', initializeGame); // دوبارہ کھیلیں بٹن پر گیم ری سیٹ کریں

// --- گیم شروع کریں جب صفحہ لوڈ ہو ---
initializeGame();