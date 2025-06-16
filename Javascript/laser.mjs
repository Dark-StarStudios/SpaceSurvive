export class Laser {
    constructor(x, y, angle, speed) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed;
      this.lifetime = 0;
      this.maxLifetime = 250;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.lifetime++;
    }
  
    render(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.speedX * 2, this.y - this.speedY * 2); // Increased length
      ctx.strokeStyle = '#00ffff'; // color
      ctx.lineWidth = 3; // Increased width
      ctx.stroke();
      ctx.closePath();
    }
  
    isExpired() {
      return this.lifetime >= this.maxLifetime;
    }
  }