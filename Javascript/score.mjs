export class Score {

    constructor() {
        this.quantity = [];
    }
    load(){
        const storedScores = localStorage.getItem('spaceInvadersHighScores');
        if (storedScores) {
            return JSON.parse(storedScores);
        } else {
            return [];
        }
    }
    save(score, nickname){
        this.quantity.push({ score, nickname }); // Add new score to high scores
        this.quantity.sort((a, b) => b.score - a.score); // Sort high scores in descending order
        this.quantity = this.quantity.slice(0, 5); // Keep only the top 5 scores
        localStorage.setItem('spaceInvadersHighScores', JSON.stringify(this.quantity)); // Save to local storage
        console.log("High scores saved to local storage:", this.quantity);
    }
}

// // Load high scores from local storage
// function loadHighScores() {
//   const storedScores = localStorage.getItem('spaceInvadersHighScores');
//   if (storedScores) {
//     highScores = JSON.parse(storedScores); // Parse stored high scores
//   } else {
//     highScores = []; // If no scores are stored, initialize as an empty array
//   }
//   console.log("High scores loaded from local storage:", highScores);
// }


// // Save new high score to local storage
// function saveHighScore(score, nickname) {
//   highScores.push({ score, nickname }); // Add new score to high scores
//   highScores.sort((a, b) => b.score - a.score); // Sort high scores in descending order
//   highScores = highScores.slice(0, 5); // Keep only the top 5 scores
//   localStorage.setItem('spaceInvadersHighScores', JSON.stringify(highScores)); // Save to local storage
//   console.log("High scores saved to local storage:", highScores);
// }