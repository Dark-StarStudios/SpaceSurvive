import { Invader } from "./Invaders.mjs";
import { Modal } from './modal.mjs';
export class gameLogic {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.enemiesKilled = 0;
        this.killsToNextWave = 10;
        this.wave = 0;
    }
    spawn(invaders, speed) {
        if (invaders.length >= this.config.MAX_UNITS) return; // Prevent spawning if at max
        let x, y;
        // Randomly choose which edge to spawn from
        const side = Math.floor(Math.random() * 4); 
        switch (side) {
            case 0:
            x = Math.random() * this.canvas.width;
            y = -30;
            break;
            case 1:
            x = this.canvas.width + 30;
            y = Math.random() * this.canvas.height;
            break;
            case 2:
            x = Math.random() * this.canvas.width;
            y = this.canvas.height + 30;
            break;
            case 3:
            x = -30;
            y = Math.random() * this.canvas.height;
            break;
        }
        const actualSpeed = speed * (0.8 + Math.random() * 0.4); // Add randomness to invader speed
        invaders.push(new Invader(x, y, actualSpeed, 0, 0)); // Create new invader
    }
    startNewWave(invaders) {
        this.wave++; // Increment wave 
        const numInvaders = Math.min(5 + this.wave, this.config.MAX_UNITS); // Cap invaders per wave
        const baseSpeed = 1 + this.wave * 0.2; // Slightly slower speed increase
        for (let i = 0; i < numInvaders; i++) {
            this.spawn(invaders, baseSpeed); // Spawn new invaders
        }
        // console.log(`Wave ${this.wave} started with ${numInvaders} invaders!`);
    }
    gameOver(highScores, score) {
        this.config.gameState = 'gameOver'; // Set game state to 'gameOver'
        Modal.show(score, highScores.save.bind(highScores)); // Show modal to collect nickname
        // console.log("Game Over! Final score:", score);
    }
    checkCollisions(lasers, invaders, score, player, highScores) {
        // Check for collisions between lasers and invaders
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            // Remove laser if it's out of bounds
            if (laser.isExpired() || 
                laser.x < -20 || laser.x > this.canvas.width + 20 || 
                laser.y < -20 || laser.y > this.canvas.height + 20) {
                lasers.splice(i, 1); 
            }
            for (let j = invaders.length - 1; j >= 0; j--) {
            const invader = invaders[j];
            const dx = laser.x - invader.x; // Calculate horizontal distance
            const dy = laser.y - invader.y; // Calculate vertical distance
            const distance = Math.sqrt(dx * dx + dy * dy); // Calculate total distance
            
            if (distance < invader.size) { // Check if laser hits invader
                invaders.splice(j, 1); // Remove invader from array
                lasers.splice(i, 1); // Remove laser from array
                score += 50; 
                this.enemiesKilled++;
                console.log(`Invader destroyed! Score: ${score}, Enemies Killed: ${this.enemiesKilled}`);
                break; 
            }
            }
        }
        // check if player is hit by invaders
        if (this.config.gameState === 'playing') {
            for (const invader of invaders) {
            const dx = player.x - invader.x;
            const dy = player.y - invader.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < invader.size) { // Check if player collides with invader
                this.gameOver(highScores, score); // End game if player collides
                break;
            }
            }
        }
    }
}