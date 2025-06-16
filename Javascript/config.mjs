export class Config {
    constructor() {
        this.border = '3px solid #9370DB'; // border
        this.boxShadow = '0 0 10px rgba(147, 112, 219, 0.7)'; // Glow effect

        this.mouse = {
            x: 0,
            y: 0
        }
        this.gameState = 'start';
        this.time = 0;
        this.MAX_UNITS = 40;
        this.SPAWN_INTERVAL = 500;

        
    }
    draw(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.border = this.border;
        canvas.style.boxShadow = this.boxShadow;

    }
    // Take coordinates from mouse
    mousemove(canvas){
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top; 
            // console.log(`Mouse moved: x=${mouseX}, y=${mouseY}`); // Log mouse movement
        });
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
