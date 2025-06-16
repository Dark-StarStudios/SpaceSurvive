// Create and show a modal for nickname input
export class Modal {
    static show(score, saveScore) {
      const modal = document.createElement('div');
      modal.id = 'nicknameModal';
      modal.style.position = 'absolute';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.background = '#000040'; //overlay
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '1000';
    
      const modalContent = document.createElement('div');
      modalContent.style.background = '#0000ff'; // background
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '10px'; 
      modalContent.style.textAlign = 'center';
      modalContent.style.fontFamily = '"Press Start 2P", monospace';
      modalContent.style.color = '#00ffff'; // text
      modalContent.style.boxShadow = '0 0 20px #00ffff'; //  glow
    
      const title = document.createElement('h2');
      title.textContent = 'Game Over!';
      title.style.margin = '0 0 20px 0';
      title.style.fontSize = '24px';
      title.style.textShadow = '0 0 10px #2225a6'; // glow
    
      const scoreText = document.createElement('p');
      scoreText.textContent = `Score: ${score}`;
      scoreText.style.margin = '0 0 22px 0';
      scoreText.style.fontSize = '22px';
    
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter nickname (max 10 chars)';
      input.maxLength = 10;
      input.style.padding = '10px';
      input.style.fontSize = '16px';
      input.style.fontFamily = '"Press Start 2P", monospace';
      input.style.background = '#000080'; // background
      input.style.color = '#00ffff'; //  text
      input.style.border = '2px solid #00ffff'; // border
      input.style.borderRadius = '5px';
      input.style.outline = 'none';
      input.style.marginBottom = '20px';
      input.style.width = '200px';
    
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Submit';
      submitButton.style.padding = '10px 20px';
      submitButton.style.fontSize = '16px';
      submitButton.style.fontFamily = '"Press Start 2P", monospace';
      submitButton.style.background = '#000080'; // background
      submitButton.style.color = '#00ffff'; // text
      submitButton.style.border = '2px solid #00ffff'; // border
      submitButton.style.borderRadius = '5px';
      submitButton.style.cursor = 'pointer';
      submitButton.style.transition = 'background 0.3s';
      submitButton.addEventListener('mouseover', () => {
        submitButton.style.background = '#000040'; // background on hover
      });
      submitButton.addEventListener('mouseout', () => {
        submitButton.style.background = '#000080'; // background out hover
      });
    
      submitButton.addEventListener('click', () => {
        let nickname = input.value.trim();
        if (nickname && nickname !== "") {
          nickname = nickname.slice(0, 10); // Limit to 10 characters
          saveScore(score, nickname); // Save score
          // console.log("Score saved with nickname:", nickname);
        } else {
          saveScore(score, "unknown"); // Save score
          // console.log("Score saved with nickname: unknown");
        }
        modal.remove(); // Remove modal after submission
      });
    
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          submitButton.click();
        }
      });
    
      modalContent.appendChild(title);
      modalContent.appendChild(scoreText);
      modalContent.appendChild(input);
      modalContent.appendChild(submitButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      input.focus();
    }
    // Draw text with a glowing, cosmic effect
    static drawIcyText(ctx,config,canvas,text, x, y, fontSize) {
    ctx.font = `${fontSize}px "Press Start 2P", monospace`; // Use the passed fontSize argument
    ctx.textAlign = 'center';

    const maxWidth = (config.gameState === 'gameOver' && y > canvas.height / 2) ? 300 : 400; // Smaller maxWidth for high scores on game over screen
    const textWidth = ctx.measureText(text).width;
    if (textWidth > maxWidth) {
      fontSize = Math.floor(fontSize * (maxWidth / textWidth)); // Scale font size if text width exceeds the max width
      ctx.font = `${fontSize}px "Press Start 2P", monospace`;
    }

    const textGradient = ctx.createLinearGradient(x - 150, y - fontSize, x + 150, y + fontSize); // Create gradient for text
    textGradient.addColorStop(0, '#00ffff'); // Cosmic purple, reduced opacity
    textGradient.addColorStop(1, '#0000ff'); // Light nebula purple, reduced opacity

    ctx.fillStyle = textGradient;
    ctx.fillText(text, x, y);

    const glowIntensity = 0.3 + Math.sin(config.time) * 0.1; // Reduced intensity range
    ctx.strokeStyle = `#00ffff`; // Reduced stroke opacity
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);

    ctx.shadowColor = '#9370DB'; // Cosmic purple shadow
    ctx.shadowBlur = 8 * glowIntensity; // Reduced shadow blur
    ctx.fillStyle = `#00ffff`; // Reduced final fill opacity
    ctx.fillText(text, x, y);
  }
//---------------------------------------------------------------------------------------------------
}