// === 1. Play Background Music ===
document.addEventListener("DOMContentLoaded", () => {
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    // Muted by default due to browser policies, start on user interaction
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            // Because browser might block direct play, we handle it
            let playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    musicBtn.textContent = '🔇 Pause Music';
                    isPlaying = true;
                }).catch(error => {
                    console.log("Audio playback failed: ", error);
                });
            }
        } else {
            bgMusic.pause();
            musicBtn.textContent = '🎵 Play Music';
            isPlaying = false;
        }
    });

    // === 2. Confetti on Load ===
    // Use the confetti library added in html
    setTimeout(() => {
        let duration = 3 * 1000;
        let animationEnd = Date.now() + duration;
        let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        let interval = setInterval(function() {
            let timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            let particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }, 500);

    // === 3. Balloon Animation on Load ===
    createOnloadBalloons();
});

function createOnloadBalloons() {
    const container = document.getElementById('onload-balloons');
    const colors = ['#ff5e62', '#ffde59', '#00bcd4', '#4caf50', '#9c27b0'];
    
    for (let i = 0; i < 15; i++) {
        let balloon = document.createElement('div');
        balloon.className = 'load-balloon';
        balloon.textContent = '🎈';
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.color = colors[Math.floor(Math.random() * colors.length)];
        // Randomize animation duration and delay
        let duration = Math.random() * 3 + 4; // 4s to 7s
        let delay = Math.random() * 2;
        balloon.style.animationDuration = duration + 's';
        balloon.style.animationDelay = delay + 's';
        
        container.appendChild(balloon);

        // Remove element after animation ends
        setTimeout(() => {
            balloon.remove();
        }, (duration + delay) * 1000);
    }
}

// === 4. Mini Game (Balloon Pop) ===
const startBtn = document.getElementById('start-game');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameInterval;
let isGameRunning = false;
let gameDuration = 20000; // 20 seconds

startBtn.addEventListener('click', startGame);

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    scoreDisplay.innerText = score;
    startBtn.innerText = "Game Running...";
    startBtn.disabled = true;

    // Clear existing balloons
    const existing = gameArea.querySelectorAll('.game-balloon');
    existing.forEach(b => b.remove());

    // Generate balloons
    gameInterval = setInterval(spawnBalloon, 800);

    // End game after 20 seconds
    setTimeout(endGame, gameDuration);
}

function spawnBalloon() {
    const balloon = document.createElement('div');
    balloon.classList.add('game-balloon');
    
    // Random horizontal position
    const areaWidth = gameArea.clientWidth;
    const maxLeft = areaWidth - 60; // 60 is balloon width
    const randomLeft = Math.floor(Math.random() * maxLeft);
    balloon.style.left = randomLeft + 'px';

    // Different colors for game balloons
    const colors = ['#ff5e62', '#ffde59', '#00bcd4', '#4caf50', '#9c27b0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;

    // Different speeds
    const speed = Math.random() * 2 + 3; // 3s to 5s
    balloon.style.animationDuration = speed + 's';

    gameArea.appendChild(balloon);

    // Click event for popping
    balloon.addEventListener('mousedown', function() {
        if (!isGameRunning) return;
        score++;
        scoreDisplay.innerText = score;
        
        // Pop effect
        this.style.pointerEvents = 'none'; // Prevent double click
        this.innerHTML = "💥";
        this.style.backgroundColor = 'transparent';
        this.style.boxShadow = 'none';
        
        // Add tiny confetti pop inside game area
        let rect = this.getBoundingClientRect();
        confetti({
            particleCount: 15,
            spread: 40,
            origin: {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
            },
            zIndex: 100
        });

        setTimeout(() => {
            if(gameArea.contains(this)){
                this.remove();
            }
        }, 200);
    });

    // Remove if it floats outside top
    setTimeout(() => {
        if (gameArea.contains(balloon)) {
            balloon.remove();
        }
    }, speed * 1000);
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    startBtn.innerText = "Play Again";
    startBtn.disabled = false;
    alert(`Time's up! 🎉 You popped ${score} balloons! Happy Birthday!`);
}
