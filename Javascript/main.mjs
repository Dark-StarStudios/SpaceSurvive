import { Player } from './player.mjs'; // Import Player class
import { Star } from './star.mjs'; // Import Star class
import { Config } from './config.mjs'; // Import canvas element
import { Score } from './score.mjs';
import { gameLogic } from './gameLogic.mjs';

const config = new Config(); // Create a new Config object
let highScores = new Score();// Array to store high scores



 // Get the game canvas element and check if it's properly loaded
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  console.error("Canvas not found!"); // If canvas is not found, log an error
}
config.draw(canvas);
const ctx = canvas.getContext('2d'); // Get the context to draw on the canvas
if (!ctx) {
  console.error("Canvas context not found!"); // If context is not found, log an error
}
const Logic = new gameLogic(canvas, config);
// Set canvas to be focusable and listen for clicks
canvas.setAttribute('tabindex', '0');
canvas.style.outline = 'none'; // Remove focus outline
canvas.focus();
canvas.addEventListener('click', () => {
  canvas.focus(); // Focus canvas when clicked
  if (config.gameState === 'playing') Logic.shootLaser( player, lasers); // Shoot laser if game is in 'playing' state
});
// Handle mouse movement to track mouse position on the canvas
config.mousemove(canvas);

// Declare variables to store game elements
let player, invaders, stars, lasers, score, lastScoreTime, wave, gameStartTime, keys;
let lastSpawnTime = Date.now(); // Last time invader was spawned
keys = {};

// Initialize the game by resetting variables and creating game objects
async function initGame() {
  keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    ' ': false,
    'Shift': false
  };

  player = new Player(400, 300, 20); // Create the player at the center of the canvas
  invaders = []; // Initialize invaders array
  stars = []; // Initialize stars array
  Star.spawn(canvas, stars,1000);

  lasers = []; // Initialize lasers array
  score = 100; // Starting score
  lastScoreTime = Date.now(); // Initialize score timer
  wave = 0; // Initialize wave number
  gameStartTime = Date.now(); // Initialize game start time
  lastSpawnTime = Date.now(); // Initialize invader spawn time
  config.gameState = 'start'; // Set game state to start
  config.time = 0; // Initialize time for effects

  highScores.load(); // Load high scores
  console.log("Game initialized! Player:", player, "Invaders:", invaders, "Stars:", stars);
}
























// Handle keyboard inputs

document.addEventListener('keydown', (e) => {
  if (['w', 'a', 's', 'd', ' ', 'h', 'Shift'].includes(e.key) && config.gameState !== 'gameOver') {
    e.preventDefault(); // Prevent default action for movement, shoot, high score, and Shift keys
  }
  keys[e.key] = true; // Mark key as pressed
  if (config.gameState === 'start' && e.key.toLowerCase() === 's') {
    config.gameState = 'playing'; // Start the game when 'S' is pressed
    Logic.startNewWave(wave, invaders, gameStartTime); // Start a new wave
    console.log("Game started!");
  } else if (config.gameState === 'start' && e.key.toLowerCase() === 'h') {
    config.gameState = 'highScores'; // Show high scores when 'H' is pressed
    console.log("High scores displayed!");
  } else if (config.gameState === 'highScores' && (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'h')) {
    config.gameState = 'start'; // Return to start screen when 'S' or 'H' is pressed
    console.log("Returned to start screen!");
  } else if (config.gameState === 'playing' && e.key === ' ') {
    Logic.shootLaser(player, lasers); // Shoot laser when spacebar is pressed
  } else if (config.gameState === 'gameOver' && e.key.toLowerCase() === 'r') {
    initGame(); // Restart the game when 'R' is pressed
    console.log("Game restarted!");
  }
});

// Listen for key releases to stop player movement
document.addEventListener('keyup', (e) => {
  keys[e.key] = false; // Mark key as released
});



// Check for collisions between lasers and invaders, or player and invaders























// Handle game over state, showing modal for nickname input
























// Update the game state every frame
function update() {
  const currentTime = Date.now();
  config.time += 0.02; // Slower increment for slower pulsing effect
  
  if (config.gameState === 'playing') {
    player.update(canvas.width, canvas.height, keys);
    
    invaders.forEach(invader => invader.update(canvas.width, canvas.height, player.x, player.y));
    invaders = invaders.filter(invader => {
      if (invader.markedForDeletion) return false;
      return !(invader.x < -50 || invader.x > canvas.width + 50 || 
               invader.y < -50 || invader.y > canvas.height + 50);
    });

    stars.forEach(star => star.update(canvas));
    
    for (let i = lasers.length - 1; i >= 0; i--) {
      const laser = lasers[i];
      laser.update();
      if (laser.isExpired() || 
          laser.x < -20 || laser.x > canvas.width + 20 || 
          laser.y < -20 || laser.y > canvas.height + 20) {
        lasers.splice(i, 1); // Remove laser
      }
    }
    
    Logic.checkCollisions(lasers, invaders, score, player, highScores); // Check for collisions every frame
    
    if (currentTime - lastScoreTime >= 1000) {
      score += 10; // Increase score by 10 every second
      lastScoreTime = currentTime;
    }
    
    if (currentTime - lastSpawnTime > config.SPAWN_INTERVAL && invaders.length < config.MAX_UNITS) {
      const baseSpeed = 1 + wave * 0.2;
      Logic.spawn(invaders, baseSpeed); // Spawn single invader
      lastSpawnTime = currentTime;
    }
    
    if (invaders.length === 0 && currentTime - gameStartTime > 1000) {
      Logic.startNewWave(wave, invaders, gameStartTime); // Start new wave after a brief delay
    }
  }
  console.log("Update loop running! Invaders:", invaders.length, "Lasers:", lasers.length);
}
































// Draw text with a glowing, cosmic effect
function drawIcyText(text, x, y, fontSize) {
  ctx.font = `${fontSize}px "Press Start 2P", monospace`; // Use the passed fontSize argument
  ctx.textAlign = 'center';

  const maxWidth = (config.gameState === 'gameOver' && y > canvas.height / 2) ? 300 : 400; // Smaller maxWidth for high scores on game over screen
  const textWidth = ctx.measureText(text).width;
  if (textWidth > maxWidth) {
    fontSize = Math.floor(fontSize * (maxWidth / textWidth)); // Scale font size if text width exceeds the max width
    ctx.font = `${fontSize}px "Press Start 2P", monospace`;
  }

  const textGradient = ctx.createLinearGradient(x - 150, y - fontSize, x + 150, y + fontSize); // Create gradient for text
  textGradient.addColorStop(0, 'rgba(147, 112, 219, 0.7)'); // Cosmic purple, reduced opacity
  textGradient.addColorStop(1, 'rgba(200, 162, 255, 0.7)'); // Light nebula purple, reduced opacity

  for (let i = 0; i < 5; i++) {
    const offsetX = (Math.random() - 0.5) * 3;
    const offsetY = (Math.random() - 0.5) * 3;
    ctx.fillStyle = `rgba(200, 162, 255, ${0.1 - i * 0.015})`; // Reduced glow opacity
    ctx.fillText(text, x + offsetX, y + offsetY);
  }

  ctx.fillStyle = textGradient;
  ctx.fillText(text, x, y);

  const glowIntensity = 0.3 + Math.sin(config.time) * 0.1; // Reduced intensity range
  ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.3})`; // Reduced stroke opacity
  ctx.lineWidth = 2;
  ctx.strokeText(text, x, y);

  ctx.shadowColor = '#9370DB'; // Cosmic purple shadow
  ctx.shadowBlur = 8 * glowIntensity; // Reduced shadow blur
  ctx.fillStyle = `rgba(147, 112, 219, ${glowIntensity * 0.7})`; // Reduced final fill opacity
  ctx.fillText(text, x, y);
}









































// Main render function to draw everything on the game canvas
function render() {
  ctx.fillStyle = 'rgba(10, 10, 35, 0.3)'; // Deep cosmic blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas background with cosmic color
  
  stars.forEach(star => star.render(ctx)); // Render all stars
  
  if (config.gameState === 'playing') {
    // if (keys['Shift']) { // Draw laser guide only when Shift is held
    //   ctx.beginPath();
    //   ctx.moveTo(player.x, player.y); // Draw line from player to mouse position
    //   ctx.lineTo(config.mouse.x, config.mouse.y);
    //   ctx.strokeStyle = 'rgba(100, 149, 237, 0.7)'; // Nebula blue laser guide
    //   ctx.lineWidth = 1;
    //   ctx.stroke();
    //   ctx.closePath();
    // }
    
    lasers.forEach(laser => laser.render(ctx)); // Render all lasers
    invaders.forEach(invader => invader.render(ctx)); // Render all invaders
    player.render(ctx); // Render the player
    
    ctx.font = '25px "Press Start 2P", monospace'; // Consistent font size
    ctx.fillStyle = '#E6E6FA'; // Lavender text
    ctx.shadowColor = '#483D8B'; // Dark slate blue shadow
    ctx.shadowBlur = 5;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Wave: ${wave}`, 20, 80);
  } else if (config.gameState === 'start') {
    ctx.fillStyle = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw start screen overlay
    drawIcyText('SPACE INVADERS', canvas.width / 2, canvas.height / 2 - 150, 50); // Title text
    drawIcyText('Press S to Start', canvas.width / 2, canvas.height / 2 - 50, 25); // Instructions text
    drawIcyText('Press H for High Scores', canvas.width / 2, canvas.height / 2, 25); // High score text
    drawIcyText('Hold Shift to Aim', canvas.width / 2, canvas.height / 2 + 50, 25); // Aim instruction
  } else if (config.gameState === 'gameOver') {
    ctx.fillStyle = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw game over screen overlay
    drawIcyText('GAME OVER', canvas.width / 2, canvas.height / 2 - 100, 50); // Game over text
    drawIcyText('Press R to Restart', canvas.width / 2, canvas.height / 2, 25); // Restart instruction
    // High scores in top-right
    drawIcyText('High Scores', canvas.width - 200, 100, 25); // Smaller title for high scores
    highScores.quantity.forEach((score, index) => {
      drawIcyText(`${index + 1}. ${score.nickname}: ${score.score}`, canvas.width - 200, 150 + index * 50, 25);
    });
  } else if (config.gameState === 'highScores') {
    ctx.fillStyle = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw high scores screen overlay
    drawIcyText('HIGH SCORES', canvas.width / 2, canvas.height / 2 - 150, 50); // Title text
    highScores.quantity.forEach((score, index) => {
      drawIcyText(`${index + 1}. ${score.nickname}: ${score.score}`, canvas.width / 2, canvas.height / 2 - 50 + index * 50, 25);
    });
    drawIcyText('Press S to Start', canvas.width / 2, canvas.height / 2 + 150, 25); // Return instruction
  }
}



// Main game loop to update and render the game
function gameLoop() {
  update(); // Update game state
  render(); // Render the game screen
  requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
}



// Initialize and start the game
initGame();
gameLoop();