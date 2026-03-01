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
     */
    drawGameState(ctx, canvasWidth, canvasHeight, state) {
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

            // Instructions
            ctx.font = this.hudFont;
            ctx.fillText('PRESS SPACE TO START', centerX, centerY);
            ctx.fillText('ARROW KEYS TO MOVE', centerX, centerY + 40);
            ctx.fillText('SPACE TO SHOOT', centerX, centerY + 80);
        } else if (state === 'GAME_OVER') {
            ctx.font = this.stateFont;
            ctx.fillText('GAME OVER', centerX, centerY);

            ctx.font = this.hudFont;
            ctx.fillText('PRESS SPACE TO RESTART', centerX, centerY + 60);
        } else if (state === 'WIN') {
            ctx.font = this.stateFont;
            ctx.fillText('YOU WIN!', centerX, centerY);

            ctx.font = this.hudFont;
            ctx.fillText('PRESS SPACE TO RESTART', centerX, centerY + 60);
        }

        ctx.restore();
    }

    /**
     * Draw pause overlay with semi-transparent background
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} canvasWidth - Width of the canvas
     * @param {number} canvasHeight - Height of the canvas
     */
    drawPauseOverlay(ctx, canvasWidth, canvasHeight) {
        ctx.save();

        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw pause text
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowBlur;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        ctx.font = this.stateFont;
        ctx.fillText('PAUSED', centerX, centerY - 40);

        ctx.font = this.hudFont;
        ctx.fillText('PRESS P OR ESC TO RESUME', centerX, centerY + 40);

        ctx.restore();
    }
}
