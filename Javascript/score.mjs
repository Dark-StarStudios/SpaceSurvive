export class Score {

    constructor() {
        this.quantity = []; // scores from players
    }
    //  Get high scores from local storage
    load(){
        const storedScores = localStorage.getItem('scores');
        if (storedScores) {
            return JSON.parse(storedScores);
        } else {
            return [];
        }
    }
    save(score, nickname){
        this.quantity.push({ score, nickname }); // Add new score
        this.quantity.sort((a, b) => b.score - a.score); // Sort high scores in descending order
        this.quantity = this.quantity.slice(0, 5); // Keep only the top 5 scores
        localStorage.setItem('scores', JSON.stringify(this.quantity)); // Save to local storage
        // console.log("High scores saved to local storage:", this.quantity);
    }
}
