export class Invader {
  constructor(x, y, radius, speed, playerX, playerY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.targetX = playerX;
    this.targetY = playerY;

    // Random color for each invader
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.color = `rgb(${r}, ${g}, ${b})`;
    this.glowColor = `rgba(${r}, ${g}, ${b}, 0.8)`; // Glow color matches the invader

    // Initial direction toward the player's position
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      this.speedX = (dx / distance) * this.speed;
      this.speedY = (dy / distance) * this.speed;
    } else {
      this.speedX = this.speed;
      this.speedY = 0;
    }
    console.log(`Invader spawned at (${this.x}, ${this.y}) with color ${this.color}`);
  }

  update(canvasWidth, canvasHeight, playerX, playerY) {
    // Recalculate direction to the player's current position every few frames
    if (Math.random() < 0.05) { // Increased frequency to 5% for more responsive chasing
      this.targetX = playerX;
      this.targetY = playerY;
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        this.speedX = (dx / distance) * this.speed;
        this.speedY = (dy / distance) * this.speed;
      }
    }
    
    // Move according to current velocity
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Don't clamp to screen edges - let invaders move offscreen
    console.log(`Invader updated: x=${this.x}, y=${this.y}, targeting (${this.targetX}, ${this.targetY})`);
  }

  
  render(ctx) {
    // Draw the invader with a glow effect
    // Main body
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    
    // Glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      this.x, this.y, this.radius,
      this.x, this.y, this.radius + 5
    );
    gradient.addColorStop(0, this.glowColor);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
    
    // Dynamic comet tail
    const tailLength = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY) * 5; // Tail length based on speed
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.speedX * tailLength, this.y - this.speedY * tailLength);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
    ctx.lineWidth = this.radius * 1.5;
    ctx.stroke();
    ctx.closePath();
  }
}