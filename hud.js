export class HUD {
    constructor() {
        this.hudFont = '20px Courier New';
        this.stateFont = '48px Courier New';
        this.color = '#00FF00';
        this.glowBlur = 10;
    }

    /**
     * Draw the score in the top-left corner
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} score - The current score
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawScore(ctx, score, x, y) {
        ctx.save();
        ctx.font = this.hudFont;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowBlur;
        ctx.fillText(`SCORE: ${score}`, x, y);
        ctx.restore();
    }

    /**
     * Draw the high score
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} highScore - The high score
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawHighScore(ctx, highScore, x, y) {
        ctx.save();
        ctx.font = this.hudFont;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowBlur;
        ctx.fillText(`HIGH SCORE: ${highScore}`, x, y);
        ctx.restore();
    }

    /**
     * Draw the lives count in the top-right corner
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} lives - The number of lives remaining
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawLives(ctx, lives, x, y) {
        ctx.save();
        ctx.font = this.hudFont;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowBlur;
        ctx.fillText(`LIVES: ${lives}`, x, y);
        ctx.restore();
    }

    /**
     * Draw game state messages (START, GAME_OVER, WIN) centered on screen
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} canvasWidth - Width of the canvas
     * @param {number} canvasHeight - Height of the canvas
     * @param {string} state - The current game state
     * @param {number} highScore - The high score (optional)
     */
    drawGameState(ctx, canvasWidth, canvasHeight, state, highScore = 0) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowBlur;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        if (state === 'START') {
            // Main title
            ctx.font = this.stateFont;
            ctx.fillText('SPACE INVADERS', centerX, centerY - 80);

            // High score display
            if (highScore > 0) {
                ctx.font = this.hudFont;
                ctx.fillText(`HIGH SCORE: ${highScore}`, centerX, centerY - 30);
            }

            // Instructions
            ctx.font = this.hudFont;
            ctx.fillText('PRESS SPACE TO START', centerX, centerY + 20);
            ctx.fillText('ARROW KEYS TO MOVE', centerX, centerY + 60);
            ctx.fillText('SPACE TO SHOOT', centerX, centerY + 100);
        } else if (state === 'GAME_OVER') {
            ctx.font = this.stateFont;
            ctx.fillText('GAME OVER', centerX, centerY);

            // High score display
            if (highScore > 0) {
                ctx.font = this.hudFont;
                ctx.fillText(`HIGH SCORE: ${highScore}`, centerX, centerY - 80);
            }

            ctx.font = this.hudFont;
            ctx.fillText('PRESS SPACE TO RESTART', centerX, centerY + 60);
        } else if (state === 'WIN') {
            ctx.font = this.stateFont;
            ctx.fillText('YOU WIN!', centerX, centerY);

            // High score display
            if (highScore > 0) {
                ctx.font = this.hudFont;
                ctx.fillText(`HIGH SCORE: ${highScore}`, centerX, centerY - 80);
            }

            ctx.font = this.hudFont;
            ctx.fillText('PRESS SPACE TO RESTART', centerX, centerY + 60);
        }

        ctx.restore();
    }
}
