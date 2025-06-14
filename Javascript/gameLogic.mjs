import { Invader } from "./Invaders.mjs";
import { Laser } from './laser.mjs'; // Import Laser class
import { Modal } from './modal.mjs';
export class gameLogic {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
    }
    spawn(invaders, speed) {
        if (invaders.length >= this.config.MAX_UNITS) return; // Prevent spawning if at max
        let x, y;
        const side = Math.floor(Math.random() * 4); // Randomly choose which edge to spawn from
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
        invaders.push(new Invader(x, y, 15, actualSpeed, 0, 0)); // Create new invader
    }
    startNewWave(wave, invaders, gameStartTime) {
        wave++; // Increment wave number
        const numInvaders = Math.min(5 + wave, this.config.MAX_UNITS); // Cap invaders per wave
        const baseSpeed = 1 + wave * 0.2; // Slightly slower speed increase
        invaders = []; // Clear existing invaders to start fresh
        for (let i = 0; i < numInvaders; i++) {
            this.spawn(invaders, baseSpeed); // Spawn new invaders
        }
        gameStartTime = Date.now(); // Reset wave start time
        console.log(`Wave ${wave} started with ${numInvaders} invaders!`);
    }
    gameOver(highScores, score) {
        this.config.gameState = 'gameOver'; // Set game state to 'gameOver'
        Modal.show(score, highScores.save.bind(highScores)); // Show modal to collect nickname
        console.log("Game Over! Final score:", score);
    }
    shootLaser(player, lasers) {
        const angle = Math.atan2(this.config.mouse.y - player.y, this.config.mouse.x - player.x); // Calculate angle to mouse
        lasers.push(new Laser(player.x, player.y, angle, 8)); // Create new laser
        console.log("Laser shot at angle:", angle); // Log the angle of the shot
    }
    checkCollisions(lasers, invaders, score, player, highScores) {
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            for (let j = invaders.length - 1; j >= 0; j--) {
            const invader = invaders[j];
            const dx = laser.x - invader.x; // Calculate horizontal distance
            const dy = laser.y - invader.y; // Calculate vertical distance
            const distance = Math.sqrt(dx * dx + dy * dy); // Calculate total distance
            
            if (distance < invader.radius) { // Check if laser hits invader
                invaders.splice(j, 1); // Remove invader from array
                lasers.splice(i, 1); // Remove laser from array
                score += 50; // Increase score
                console.log(`Invader destroyed! Score: ${score}`);
                break; // Exit loop if a hit is detected
            }
            }
        }
        
        if (this.config.gameState === 'playing') {
            for (const invader of invaders) {
            const dx = player.x - invader.x;
            const dy = player.y - invader.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < player.size / 2 + invader.radius) { // Check if player collides with invader
                this.gameOver(highScores, score); // End game if player collides
                break;
            }
            }
        }
    }
}