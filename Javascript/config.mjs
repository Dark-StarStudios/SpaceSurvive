export class config {
    constructor() {
        this.border = '3px solid #9370DB'; // Cosmic purple border
        this.boxShadow = '0 0 10px rgba(147, 112, 219, 0.7)'; // Glow effect
    }
    static draw(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.border = this.border;
        canvas.style.boxShadow = this.boxShadow;

    }

}





//     // Get the game canvas element and check if it's properly loaded
// const canvas = document.getElementById('gameCanvas');
// if (!canvas) {
//   console.error("Canvas not found!"); // If canvas is not found, log an error
// }
// const ctx = canvas.getContext('2d'); // Get the context to draw on the canvas
// if (!ctx) {
//   console.error("Canvas context not found!"); // If context is not found, log an error
// }
