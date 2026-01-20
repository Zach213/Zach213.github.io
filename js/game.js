class Star {
    constructor(canvas, speed = 2) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
        this.speed = speed;
        this.size = Math.random() * 20 + 10;
        this.caught = false;
        this.points = Math.floor(this.size / 5);
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.color = this.generateColor();
        this.trail = [];
        this.maxTrailLength = 5;
    }

    generateColor() {
        const colors = [
            '#0984e3', // Blue
            '#00b894', // Green
            '#6c5ce7', // Purple
            '#fdcb6e', // Yellow
            '#e17055'  // Orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.trail = [];
        this.opacity = 1;
    }

    update() {
        if (!this.caught) {
            // Update trail
            this.trail.unshift({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.pop();
            }

            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            
            if (this.y > this.canvas.height) {
                this.reset();
            }
        } else {
            this.opacity -= 0.05;
            if (this.opacity <= 0) {
                this.reset();
                this.caught = false;
            }
        }
    }

    drawStar(x, y, size, opacity = 1) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.rotation);
        this.ctx.beginPath();
        
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const outerX = Math.cos(angle) * size;
            const outerY = Math.sin(angle) * size;
            const innerX = Math.cos(angle + Math.PI / 5) * (size * 0.4);
            const innerY = Math.sin(angle + Math.PI / 5) * (size * 0.4);
            
            if (i === 0) {
                this.ctx.moveTo(outerX, outerY);
            } else {
                this.ctx.lineTo(outerX, outerY);
            }
            this.ctx.lineTo(innerX, innerY);
        }
        
        this.ctx.closePath();
        
        // Add glow effect
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 20;
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `${this.color}ff`);
        gradient.addColorStop(1, `${this.color}00`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = opacity;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    draw() {
        if (!this.caught || this.opacity > 0) {
            // Draw trail
            this.trail.forEach((pos, index) => {
                const trailOpacity = (this.maxTrailLength - index) / this.maxTrailLength * 0.3;
                this.drawStar(pos.x, pos.y, this.size * 0.8, trailOpacity);
            });

            // Draw main star
            this.drawStar(this.x, this.y, this.size, this.opacity);
        }
    }

    checkCollision(x, y) {
        if (!this.caught) {
            const distance = Math.sqrt(
                Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)
            );
            if (distance < this.size) {
                this.caught = true;
                return this.points;
            }
        }
        return 0;
    }
}

class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.stars = [];
        this.active = true;
        this.timeLeft = 30;
        this.highScore = localStorage.getItem('starGameHighScore') || 0;
        
        this.gameUI = document.createElement('div');
        this.gameUI.classList.add('game-ui');
        this.gameUI.innerHTML = `
            <div class="game-stats">
                <div class="game-score">Score: <span>0</span></div>
                <div class="game-high-score">Best: <span>${this.highScore}</span></div>
                <div class="game-timer">Time: <span>30</span>s</div>
            </div>
            <button class="game-restart">New Game</button>
        `;
        
        this.setupGame();
    }

    setupGame() {
        const hero = document.querySelector('.hero');
        hero.prepend(this.canvas);
        hero.prepend(this.gameUI);

        // Adjust canvas position to account for navbar
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar.offsetHeight;
        this.canvas.style.top = `${navbarHeight}px`;
        this.canvas.style.height = `calc(100% - ${navbarHeight}px)`;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('mousemove', (e) => this.handleInteraction(e));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleInteraction(e.touches[0]);
        });

        this.createStars();
        this.gameLoop();
        this.startTimer();

        this.gameUI.querySelector('.game-restart').addEventListener('click', () => {
            this.restartGame();
        });
    }

    resizeCanvas() {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar.offsetHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - navbarHeight;
    }

    createStars() {
        this.stars = [];
        const starCount = Math.floor(window.innerWidth / 200); // Adjust star density
        for (let i = 0; i < starCount; i++) {
            this.stars.push(new Star(this.canvas));
        }
    }

    handleInteraction(e) {
        if (!this.active) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.stars.forEach(star => {
            const points = star.checkCollision(x, y);
            if (points) {
                this.score += points;
                this.updateScore();
            }
        });
    }

    updateScore() {
        this.gameUI.querySelector('.game-score span').textContent = this.score;
    }

    startTimer() {
        const timerDisplay = this.gameUI.querySelector('.game-timer span');
        this.timer = setInterval(() => {
            this.timeLeft--;
            timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.active = false;
        clearInterval(this.timer);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('starGameHighScore', this.highScore);
            this.gameUI.querySelector('.game-high-score span').textContent = this.highScore;
            
            // Show special message for high score
            alert(`🎉 New High Score: ${this.score}! 🎉`);
        } else {
            alert(`Game Over! Your score: ${this.score}`);
        }
    }

    restartGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.active = true;
        this.updateScore();
        this.gameUI.querySelector('.game-timer span').textContent = this.timeLeft;
        this.createStars();
        clearInterval(this.timer);
        this.startTimer();
    }

    gameLoop() {
        if (this.active) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.stars.forEach(star => {
                star.update();
                star.draw();
            });
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 