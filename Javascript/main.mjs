import { Player } from './player.mjs';
import { Star } from './star.mjs';
import { Config } from './config.mjs';
import { Score } from './score.mjs';
import { gameLogic } from './gameLogic.mjs';
import { Modal } from './modal.mjs';

const config = new Config(); // Base configuration
let Scores = new Score(); // Score 

 // Get the game canvas element and check if it's properly loaded
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  console.error("Canvas not found!"); 
}
config.draw(canvas);
// Get the context to draw on the canvas
const ctx = canvas.getContext('2d'); 
if (!ctx) {
  console.error("Canvas context not found!"); 
}
// Set canvas to be focusable and listen for clicks
canvas.setAttribute('tabindex', '0');
canvas.style.outline = 'none'; // Remove focus outline
canvas.focus();
// ----------------------------------------------------------------------------------------------------





// Shoot laser when canvas is clicked
canvas.addEventListener('click', () => {
  canvas.focus(); // Focus canvas when clicked
  if (config.gameState === 'playing') player.shootLaser(lasers); // Shoot laser if game is in 'playing' state
});

// Handle mouse movement to track mouse position on the canvas
config.mousemove(canvas);
const Logic = new gameLogic(canvas, config);

// Declare variables to store game elements
let player, invaders, stars, lasers, score, lastScoreTime, keys;
let lastSpawnTime = Date.now(); // Last time invader was spawned





// Initialize the game by resetting variables and creating game objects
async function initGame() {
  keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    ' ': false
  };

  player = new Player(canvas.width/2, canvas.height/2, 100, config); // Create the player at the center of the canvas
  invaders = []; // Initialize invaders array
  stars = []; // Initialize stars array
  /// Spawn stars on the canvas, 500 stars
  Star.spawn(canvas, stars, 500);

  lasers = []; // Initialize lasers array
  score = 100; // Starting score
  lastScoreTime = Date.now(); // Initialize score timer
  lastSpawnTime = Date.now(); // Initialize invader spawn time
  config.gameState = 'start'; // Set game state to start
  config.time = 0; // Initialize time for effects

  Scores.load(); // Load high scores
  // console.log("Game initialized! Player:", player, "Invaders:", invaders, "Stars:", stars);
}
//-------------------------------------------------------------------------------------------------------------------


// Handle keyboard inputs
keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true; // Mark key as pressed
  if ((config.gameState === 'start' || config.gameState === 'highScores') && e.key.toLowerCase() === 's' && !document.getElementById('nicknameModal')) {
    config.gameState = 'playing'; // Start the game when 'S' is pressed
    Logic.startNewWave(invaders); // Start a new wave
    // console.log("Game started!");
  } else if (config.gameState === 'start' && e.key.toLowerCase() === 'h') {
    config.gameState = 'highScores'; // Show high scores when 'H' is pressed
    // console.log("High scores displayed!");
  } else if (config.gameState === 'highScores' &&  e.key.toLowerCase() === 'h') {
    config.gameState = 'start'; // Return to start screen when 'S' or 'H' is pressed
    // console.log("Returned to start screen!");
  } else if (config.gameState === 'playing' && e.key === ' ') {
    player.shootLaser(lasers); // Shoot laser when spacebar is pressed
  } else if (config.gameState === 'gameOver') {
    Logic.wave = 0;
    initGame(); // Restart the game when 'R' is pressed
    // console.log("Game restarted!");
  }
});

// Listen for key releases to stop player movement
document.addEventListener('keyup', (e) => {
  keys[e.key] = false; // Mark key as released
});
// ---------------------------------------------------------------------------------------------------

// Update the game state every frame
function update() {
  const currentTime = Date.now();
  config.time += 0.02; // Slower increment for slower pulsing effect
  
  if (config.gameState === 'playing') {
    player.update(canvas.width, canvas.height, keys);
    
    invaders.forEach(invader => invader.update(player.x, player.y));

    stars.forEach(star => star.update(canvas));
    
    lasers.forEach(laser => laser.update());
      
    Logic.checkCollisions(lasers, invaders, score, player, Scores); // Check for collisions every frame
    
    // Increase score by 10 every second
    if (currentTime - lastScoreTime >= 1000) {
      score += 10; 
      lastScoreTime = currentTime;
    }
    // Spawn single invader
    if (currentTime - lastSpawnTime > config.SPAWN_INTERVAL && invaders.length < config.MAX_UNITS) {
      const baseSpeed = 1 + Logic.wave * 0.2;
      Logic.spawn(invaders, baseSpeed); 
      lastSpawnTime = currentTime;
    }
    // Start new wave after invaders are killed
    if (Logic.enemiesKilled >= Logic.killsToNextWave) {
      Logic.startNewWave(invaders); 
      Logic.enemiesKilled = 0;
      Logic.killsToNextWave += 10;
    }
  }
  // console.log("Update loop running! Invaders:", invaders.length, "Lasers:", lasers.length);
}
// ---------------------------------------------------------------------------------------------------

// Main render function to draw everything on the game canvas
function render() {
  ctx.fillStyle = 'rgba(10, 10, 35, 0.3)'; // Deep cosmic blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas background with cosmic color
  
  stars.forEach(star => star.render(ctx)); // Render all stars
  
  if (config.gameState === 'playing') {

    lasers.forEach(laser => laser.render(ctx)); // Render all lasers
    invaders.forEach(invader => invader.render(ctx)); // Render all invaders
    player.render(ctx, config.mouse.x, config.mouse.y); // Render the player
    
    ctx.font = '25px "Press Start 2P", monospace'; // Consistent font size
    ctx.fillStyle = '#00ffff'; // text
    ctx.shadowColor = '#2225a6'; // shadow
    ctx.shadowBlur = 5;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Wave: ${Logic.wave}`, 20, 80);

  } else if (config.gameState === 'start') {
    ctx.fillStyle = '#000040'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw start screen overlay
    Modal.drawIcyText(ctx,config,canvas,'SPACE SURVIVE', canvas.width / 2, canvas.height / 2 - 150, 50); // Title text
    Modal.drawIcyText(ctx,config,canvas,'Press S to Start', canvas.width / 2, canvas.height / 2 - 50, 25); // Instructions text
    Modal.drawIcyText(ctx,config,canvas,'Press H for Look at Scores', canvas.width / 2, canvas.height / 2, 25); // Score text
  } else if (config.gameState === 'highScores') {
    ctx.fillStyle = '#000040'; // Deep cosmic blue overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw high scores screen overlay
    Modal.drawIcyText(ctx,config,canvas,'HIGH SCORES', canvas.width / 2, canvas.height / 2 - 150, 50); // Title text
    Scores.quantity.forEach((score, index) => {
      Modal.drawIcyText(ctx,config,canvas,`${index + 1}. ${score.nickname}: ${score.score}`, canvas.width / 2, canvas.height / 2 - 50 + index * 50, 25);
    });
    Modal.drawIcyText(ctx,config,canvas,'Press S to Start', canvas.width / 2, canvas.height / 2 + 150, 25); // Return instruction
  }
}
//---------------------------------------------------------------------------------------------------


// Main game loop to update and render the game
function gameLoop() {
  update(); // Update game state
  render(); // Render the game screen
  requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
}

// Initialize and start the game
initGame();
gameLoop();