// import { Score } from './score.mjs';
// Create and show a modal for nickname input
export class Modal {
    static show(score, saveHighScore) {
      const modal = document.createElement('div');
      modal.id = 'nicknameModal';
      modal.style.position = 'absolute';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.background = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '1000';
    
      const modalContent = document.createElement('div');
      modalContent.style.background = 'rgba(147, 112, 219, 0.9)'; // Cosmic purple background
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '10px'; 
      modalContent.style.textAlign = 'center';
      modalContent.style.fontFamily = '"Press Start 2P", monospace';
      modalContent.style.color = '#E6E6FA'; // Lavender text
      modalContent.style.boxShadow = '0 0 20px rgba(200, 162, 255, 0.7)'; // Nebula purple glow
    
      const title = document.createElement('h2');
      title.textContent = 'Game Over!';
      title.style.margin = '0 0 20px 0';
      title.style.fontSize = '24px';
      title.style.textShadow = '0 0 10px #483D8B'; // Dark slate blue shadow
    
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
      input.style.background = '#6495ED'; // Nebula blue input background
      input.style.color = '#E6E6FA'; // Lavender text
      input.style.border = '2px solid #483D8B'; // Dark slate blue border
      input.style.borderRadius = '5px';
      input.style.outline = 'none';
      input.style.marginBottom = '20px';
      input.style.width = '200px';
    
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Submit';
      submitButton.style.padding = '10px 20px';
      submitButton.style.fontSize = '16px';
      submitButton.style.fontFamily = '"Press Start 2P", monospace';
      submitButton.style.background = '#6495ED'; // Nebula blue button
      submitButton.style.color = '#E6E6FA'; // Lavender text
      submitButton.style.border = '2px solid #483D8B'; // Dark slate blue border
      submitButton.style.borderRadius = '5px';
      submitButton.style.cursor = 'pointer';
      submitButton.style.transition = 'background 0.3s';
      submitButton.addEventListener('mouseover', () => {
        submitButton.style.background = '#9370DB'; // Cosmic purple on hover
      });
      submitButton.addEventListener('mouseout', () => {
        submitButton.style.background = '#6495ED'; // Back to nebula blue
      });
    
      submitButton.addEventListener('click', () => {
        let nickname = input.value.trim();
        if (nickname && nickname !== "") {
          nickname = nickname.slice(0, 10); // Limit to 10 characters
          saveHighScore(score, nickname); // Save high score
          console.log("Score saved with nickname:", nickname);
        } else {
          console.log("No nickname entered, score not saved.");
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
}

// function showModal(score) {
//   const modal = document.createElement('div');
//   modal.id = 'nicknameModal';
//   modal.style.position = 'absolute';
//   modal.style.top = '0';
//   modal.style.left = '0';
//   modal.style.width = '100%';
//   modal.style.height = '100%';
//   modal.style.background = 'rgba(10, 10, 35, 0.7)'; // Deep cosmic blue overlay
//   modal.style.display = 'flex';
//   modal.style.alignItems = 'center';
//   modal.style.justifyContent = 'center';
//   modal.style.zIndex = '1000';

//   const modalContent = document.createElement('div');
//   modalContent.style.background = 'rgba(147, 112, 219, 0.9)'; // Cosmic purple background
//   modalContent.style.padding = '20px';
//   modalContent.style.borderRadius = '10px'; 
//   modalContent.style.textAlign = 'center';
//   modalContent.style.fontFamily = '"Press Start 2P", monospace';
//   modalContent.style.color = '#E6E6FA'; // Lavender text
//   modalContent.style.boxShadow = '0 0 20px rgba(200, 162, 255, 0.7)'; // Nebula purple glow

//   const title = document.createElement('h2');
//   title.textContent = 'Game Over!';
//   title.style.margin = '0 0 20px 0';
//   title.style.fontSize = '24px';
//   title.style.textShadow = '0 0 10px #483D8B'; // Dark slate blue shadow

//   const scoreText = document.createElement('p');
//   scoreText.textContent = `Score: ${score}`;
//   scoreText.style.margin = '0 0 22px 0';
//   scoreText.style.fontSize = '22px';

//   const input = document.createElement('input');
//   input.type = 'text';
//   input.placeholder = 'Enter nickname (max 10 chars)';
//   input.maxLength = 10;
//   input.style.padding = '10px';
//   input.style.fontSize = '16px';
//   input.style.fontFamily = '"Press Start 2P", monospace';
//   input.style.background = '#6495ED'; // Nebula blue input background
//   input.style.color = '#E6E6FA'; // Lavender text
//   input.style.border = '2px solid #483D8B'; // Dark slate blue border
//   input.style.borderRadius = '5px';
//   input.style.outline = 'none';
//   input.style.marginBottom = '20px';
//   input.style.width = '200px';

//   const submitButton = document.createElement('button');
//   submitButton.textContent = 'Submit';
//   submitButton.style.padding = '10px 20px';
//   submitButton.style.fontSize = '16px';
//   submitButton.style.fontFamily = '"Press Start 2P", monospace';
//   submitButton.style.background = '#6495ED'; // Nebula blue button
//   submitButton.style.color = '#E6E6FA'; // Lavender text
//   submitButton.style.border = '2px solid #483D8B'; // Dark slate blue border
//   submitButton.style.borderRadius = '5px';
//   submitButton.style.cursor = 'pointer';
//   submitButton.style.transition = 'background 0.3s';
//   submitButton.addEventListener('mouseover', () => {
//     submitButton.style.background = '#9370DB'; // Cosmic purple on hover
//   });
//   submitButton.addEventListener('mouseout', () => {
//     submitButton.style.background = '#6495ED'; // Back to nebula blue
//   });

//   submitButton.addEventListener('click', () => {
//     let nickname = input.value.trim();
//     if (nickname && nickname !== "") {
//       nickname = nickname.slice(0, 10); // Limit to 10 characters
//       saveHighScore(score, nickname); // Save high score
//       console.log("Score saved with nickname:", nickname);
//     } else {
//       console.log("No nickname entered, score not saved.");
//     }
//     modal.remove(); // Remove modal after submission
//   });

//   input.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       submitButton.click();
//     }
//   });

//   modalContent.appendChild(title);
//   modalContent.appendChild(scoreText);
//   modalContent.appendChild(input);
//   modalContent.appendChild(submitButton);
//   modal.appendChild(modalContent);
//   document.body.appendChild(modal);
//   input.focus();
// }