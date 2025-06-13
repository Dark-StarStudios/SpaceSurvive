import { Player } from './player.mjs'; // Import Player class
import { Invader } from './Invaders.mjs'; // Import Invader class
import { Star } from './star.mjs'; // Import Star class
import { Laser } from './laser.mjs'; // Import Laser class
import { config } from './config.mjs'; // Import canvas element
import { Modal } from './modal.mjs';
import { Score } from './score.mjs';


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



// Declare variables to store game elements
let player, invaders, stars, lasers, score, lastScoreTime, wave, gameStartTime, keys;
let mouseX = 0; // Mouse X coordinate
let mouseY = 0; // Mouse Y coordinate
let gameState = 'start'; // Game status: 'start', 'playing', 'gameOver', or 'highScores'
let highScores = new Score();// Array to store high scores
let time = 0; // Used for holographic pulsing effect
let lastSpawnTime = Date.now(); // Last time invader was spawned
const MAX_INVADERS = 20; // Maximum number of invaders on screen
const SPAWN_INTERVAL = 2000; // Spawn interval in milliseconds (2 seconds)


// Handle mouse movement to track mouse position on the canvas
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left; // Calculate mouse X relative to canvas
  mouseY = e.clientY - rect.top;  // Calculate mouse Y relative to canvas
  console.log(`Mouse moved: x=${mouseX}, y=${mouseY}`); // Log mouse movement
});


// Set canvas to be focusable and listen for clicks
canvas.setAttribute('tabindex', '0');
canvas.style.outline = 'none'; // Remove focus outline
canvas.focus();
canvas.addEventListener('click', () => {
  canvas.focus(); // Focus canvas when clicked
  if (gameState === 'playing') shootLaser(); // Shoot laser if game is in 'playing' state
});



// Save new high score to local storage
// function saveHighScore(score, nickname) {
//   highScores.push({ score, nickname }); // Add new score to high scores
//   highScores.sort((a, b) => b.score - a.score); // Sort high scores in descending order
//   highScores = highScores.slice(0, 5); // Keep only the top 5 scores
//   localStorage.setItem('spaceInvadersHighScores', JSON.stringify(highScores)); // Save to local storage
//   console.log("High scores saved to local storage:", highScores);
// }



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
  for (let i = 0; i < 100; i++) { // Generate 100 stars
    stars.push(new Star(
      Math.random() * canvas.width, // Random X position
      Math.random() * canvas.height, // Random Y position
      Math.random() * 2 + 0.5 // Random size
    ));
  }

  lasers = []; // Initialize lasers array
  score = 100; // Starting score
  lastScoreTime = Date.now(); // Initialize score timer
  wave = 0; // Initialize wave number
  gameStartTime = Date.now(); // Initialize game start time
  lastSpawnTime = Date.now(); // Initialize invader spawn time
  gameState = 'start'; // Set game state to start
  time = 0; // Initialize time for effects

  highScores.load(); // Load high scores
  console.log("Game initialized! Player:", player, "Invaders:", invaders, "Stars:", stars);
}

// Start a new wave with a controlled number of invaders
function startNewWave() {
  wave++; // Increment wave number
  const numInvaders = Math.min(5 + wave, MAX_INVADERS); // Cap invaders per wave
  const baseSpeed = 1 + wave * 0.2; // Slightly slower speed increase
  invaders = []; // Clear existing invaders to start fresh
  for (let i = 0; i < numInvaders; i++) {
    spawnInvader(baseSpeed); // Spawn new invaders
  }
  gameStartTime = Date.now(); // Reset wave start time
  console.log(`Wave ${wave} started with ${numInvaders} invaders!`);
}

// Spawn an invader at a random position on one of the canvas edges
function spawnInvader(speed) {
  if (invaders.length >= MAX_INVADERS) return; // Prevent spawning if at max
  let x, y;
  const side = Math.floor(Math.random() * 4); // Randomly choose which edge to spawn from
  switch (side) {
    case 0:
      x = Math.random() * canvas.width;
      y = -30;
      break;
    case 1:
      x = canvas.width + 30;
      y = Math.random() * canvas.height;
      break;
    case 2:
      x = Math.random() * canvas.width;
      y = canvas.height + 30;
      break;
    case 3:
      x = -30;
      y = Math.random() * canvas.height;
      break;
  }
  const actualSpeed = speed * (0.8 + Math.random() * 0.4); // Add randomness to invader speed
  invaders.push(new Invader(x, y, 15, actualSpeed, player.x, player.y)); // Create new invader
}

// Handle keyboard inputs
keys = {};
document.addEventListener('keydown', (e) => {
  if (['w', 'a', 's', 'd', ' ', 'h', 'Shift'].includes(e.key)) {
    e.preventDefault(); // Prevent default action for movement, shoot, high score, and Shift keys
  }
  keys[e.key] = true; // Mark key as pressed
  if (gameState === 'start' && e.key.toLowerCase() === 's') {
    gameState = 'playing'; // Start the game when 'S' is pressed
    startNewWave(); // Start a new wave
    console.log("Game started!");
  } else if (gameState === 'start' && e.key.toLowerCase() === 'h') {
    gameState = 'highScores'; // Show high scores when 'H' is pressed
    console.log("High scores displayed!");
  } else if (gameState === 'highScores' && (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'h')) {
    gameState = 'start'; // Return to start screen when 'S' or 'H' is pressed
    console.log("Returned to start screen!");
  } else if (gameState === 'playing' && e.key === ' ') {
    shootLaser(); // Shoot laser when spacebar is pressed
  } else if (gameState === 'gameOver' && e.key.toLowerCase() === 'r') {
    initGame(); // Restart the game when 'R' is pressed
    console.log("Game restarted!");
  }
});

// Listen for key releases to stop player movement
document.addEventListener('keyup', (e) => {
  keys[e.key] = false; // Mark key as released
});

// Shoot a laser towards the mouse position
function shootLaser() {
  const angle = Math.atan2(mouseY - player.y, mouseX - player.x); // Calculate angle to mouse
  lasers.push(new Laser(player.x, player.y, angle, 8)); // Create new laser
  console.log("Laser shot at angle:", angle); // Log the angle of the shot
}

// Check for collisions between lasers and invaders, or player and invaders
function checkCollisions() {
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
  
  if (gameState === 'playing') {
    for (const invader of invaders) {
      const dx = player.x - invader.x;
      const dy = player.y - invader.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < player.size / 2 + invader.radius) { // Check if player collides with invader
        gameOver(); // End game if player collides
        break;
      }
    }
  }
}

// Handle game over state, showing modal for nickname input
function gameOver() {
  gameState = 'gameOver'; // Set game state to 'gameOver'
  Modal.show(score, highScores.save.bind(highScores)); // Show modal to collect nickname
  console.log("Game Over! Final score:", score);
}

// Update the game state every frame
function update() {
  const currentTime = Date.now();
  time += 0.02; // Slower increment for slower pulsing effect
  
  if (gameState === 'playing') {
    player.update(canvas.width, canvas.height, keys);
    
    invaders.forEach(invader => invader.update(canvas.width, canvas.height, player.x, player.y));
    invaders = invaders.filter(invader => {
      if (invader.markedForDeletion) return false;
      return !(invader.x < -50 || invader.x > canvas.width + 50 || 
               invader.y < -50 || invader.y > canvas.height + 50);
    });

    stars.forEach(star => star.update(canvas.height));
    
    for (let i = lasers.length - 1; i >= 0; i--) {
      const laser = lasers[i];
      laser.update();
      if (laser.isExpired() || 
          laser.x < -20 || laser.x > canvas.width + 20 || 
          laser.y < -20 || laser.y > canvas.height + 20) {
        lasers.splice(i, 1); // Remove laser
      }
    }
    
    checkCollisions(); // Check for collisions every frame
    
    if (currentTime - lastScoreTime >= 1000) {
      score += 10; // Increase score by 10 every second
      lastScoreTime = currentTime;
    }
    
    if (currentTime - lastSpawnTime > SPAWN_INTERVAL && invaders.length < MAX_INVADERS) {
      const baseSpeed = 1 + wave * 0.2;
      spawnInvader(baseSpeed); // Spawn single invader
      lastSpawnTime = currentTime;
    }
    
    if (invaders.length === 0 && currentTime - gameStartTime > 1000) {
      startNewWave(); // Start new wave after a brief delay
    }
  }
  console.log("Update loop running! Invaders:", invaders.length, "Lasers:", lasers.length);
}




// Draw text with a glowing, cosmic effect
function drawIcyText(text, x, y, fontSize) {
  ctx.font = `${fontSize}px "Press Start 2P", monospace`; // Use the passed fontSize argument
  ctx.textAlign = 'center';

  const maxWidth = (gameState === 'gameOver' && y > canvas.height / 2) ? 300 : 400; // Smaller maxWidth for high scores on game over screen
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

  const glowIntensity = 0.3 + Math.sin(time) * 0.1; // Reduced intensity range
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
  
  if (gameState === 'playing') {
    if (keys['Shift']) { // Draw laser guide only when Shift is held
      ctx.beginPath();
      ctx.moveTo(player.x, player.y); // Draw line from player to mouse position
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.7)'; // Nebula blue laser guide
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
    }
    
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
  } else if (gameState === 'start') {
    ctx.fillStyle = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw start screen overlay
    drawIcyText('SPACE INVADERS', canvas.width / 2, canvas.height / 2 - 150, 50); // Title text
    drawIcyText('Press S to Start', canvas.width / 2, canvas.height / 2 - 50, 25); // Instructions text
    drawIcyText('Press H for High Scores', canvas.width / 2, canvas.height / 2, 25); // High score text
    drawIcyText('Hold Shift to Aim', canvas.width / 2, canvas.height / 2 + 50, 25); // Aim instruction
  } else if (gameState === 'gameOver') {
    ctx.fillStyle = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw game over screen overlay
    drawIcyText('GAME OVER', canvas.width / 2, canvas.height / 2 - 100, 50); // Game over text
    drawIcyText('Press R to Restart', canvas.width / 2, canvas.height / 2, 25); // Restart instruction
    // High scores in top-right
    drawIcyText('High Scores', canvas.width - 200, 100, 25); // Smaller title for high scores
    highScores.quantity.forEach((score, index) => {
      drawIcyText(`${index + 1}. ${score.nickname}: ${score.score}`, canvas.width - 200, 150 + index * 50, 25);
    });
  } else if (gameState === 'highScores') {
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