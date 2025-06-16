import { Laser } from './laser.mjs';
export class Player {
    constructor(x, y, size, config) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = 5; //Speed
      this.velocityX = 0; // Driving vector
      this.velocityY = 0; // Driving vector

      this.config = config;

      this.imgBase = new Image();
      this.imgBase.src = './assets/raket.svg';

      this.imgEngine = new Image();
      this.imgEngine.src = './assets/engineGlow.svg';

      this.engineActive = false;

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

      // Check if the player is moving
      if(this.velocityY != 0 || this.velocityX != 0) {
        this.engineActive = true;
      }else{
        this.engineActive = false;
      }
  
      // Clamp to canvas bounds
      this.x = Math.max(this.size / 2, Math.min(canvasWidth - this.size / 2, this.x));
      this.y = Math.max(this.size / 2, Math.min(canvasHeight - this.size / 2, this.y));
    }

    shootLaser(lasers) {
        const angle = Math.atan2(this.config.mouse.y - this.y, this.config.mouse.x - this.x); // Calculate angle to mouse
        lasers.push(new Laser(this.x, this.y, angle, 8)); // Create new laser
        // console.log("Laser shot at angle:", angle); // Log the angle of the shot
    }
  
    render(ctx, mouseX, mouseY) {
      const w = this.size;
      const h = this.size;

      ctx.save();
      ctx.translate(this.x, this.y);
      // Rotate the player to face the mouse
      const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
      ctx.rotate(angle+Math.PI/2);

      // Draw the player
      ctx.drawImage(this.imgBase, -w / 2, -h / 2, w, h);
      if (this.engineActive) {
        ctx.drawImage(this.imgEngine, -w / 2, -h / 2, w, h);
      }
      ctx.restore();
    }

  }