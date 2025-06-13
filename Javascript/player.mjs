export class Player {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = 5; // Player movement speed
      this.velocityX = 0; // Track velocity for aiming
      this.velocityY = 0;
    }
  
    update(canvasWidth, canvasHeight, keys) {
      this.velocityX = 0;
      this.velocityY = 0;
  
      if (keys['w'] || keys['ArrowUp']) this.velocityY = -this.speed;
      if (keys['s'] || keys['ArrowDown']) this.velocityY = this.speed;
      if (keys['a'] || keys['ArrowLeft']) this.velocityX = -this.speed;
      if (keys['d'] || keys['ArrowRight']) this.velocityX = this.speed;
  
      this.x += this.velocityX;
      this.y += this.velocityY;
  
      // Clamp to canvas bounds
      this.x = Math.max(this.size / 2, Math.min(canvasWidth - this.size / 2, this.x));
      this.y = Math.max(this.size / 2, Math.min(canvasHeight - this.size / 2, this.y));
    }
  
    render(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff00';
      ctx.fill();
      ctx.closePath();
    }
  }