export class Star {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = this.size * 0.05; // Smaller stars move slower
      this.opacity = Math.random() * 0.7 + 0.3;
      this.twinkleSpeed = Math.random() * 0.05 + 0.01;
      this.twinkleAngle = Math.random() * Math.PI * 2;
    }
  
    update(canvas) {
      // Subtle movement for parallax effect
      this.y += this.speed;
      
      // Wrap around when out of bounds
      if (this.y > canvas.height + 10) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
      
      // Twinkle effect
      this.twinkleAngle += this.twinkleSpeed;
      this.opacity = 0.3 + Math.sin(this.twinkleAngle) * 0.3 + 0.4;
    }

    static spawn(canvas, stars, amount = 100){
        for (let i = 0; i < amount; i++) { // Generate 100 stars
          stars.push(new Star(
            Math.random() * canvas.width, // Random X position
            Math.random() * canvas.height, // Random Y position
            Math.random() * 2 + 0.5 // Random size
          ));
        }
    }
  
    render(ctx) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // white
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }