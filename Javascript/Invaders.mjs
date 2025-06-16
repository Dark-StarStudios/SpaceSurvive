export class Invader {
  constructor(x, y, speed, playerX, playerY) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.size = 50 + Math.random() * 40;

  
    this.targetX = playerX;
    this.targetY = playerY;

    
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.speedX = (dx / distance) * this.speed;
    this.speedY = (dy / distance) * this.speed;

    
    this.image = new Image();
    this.image.src = './assets/Invader.png';
  }

  update(playerX, playerY) {
    
    if (Math.random() < 0.05) {
      const dx = playerX - this.x;
      const dy = playerY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.speedX = (dx / distance) * this.speed;
      this.speedY = (dy / distance) * this.speed;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.targetX = playerX;
    this.targetY = playerY;
  }

  render(ctx) {
    const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);

    ctx.save();
    ctx.translate(this.x, this.y);
    // Rotate the image to face the target
    ctx.rotate(angle + -Math.PI / 2);
    const aspectRatio = this.image.width / this.image.height;
    const h = this.size;
    const w = h * aspectRatio;

    ctx.drawImage(this.image, -w / 2, -h / 2, w, h);

    ctx.restore();
  }
}
