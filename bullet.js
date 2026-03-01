/**
 * Bullet class - represents a single projectile
 */
export class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = -5; // Negative for upward movement
        this.active = true;
        this.width = 3;
        this.height = 10;
    }

    /**
     * Update bullet position
     */
    update() {
        this.y += this.speed;
    }

    /**
     * Draw bullet as green rectangle with glow effect
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // Outer glow
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = 10;

        // Draw bullet
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Inner highlight for more glow
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.restore();
    }

    /**
     * Check if bullet has left the canvas
     * @param {number} canvasHeight - Height of the canvas
     * @returns {boolean} True if bullet is off screen
     */
    isOffScreen(canvasHeight) {
        return this.y + this.height < 0;
    }
}

/**
 * BulletManager class - manages multiple bullets
 */
export class BulletManager {
    constructor() {
        this.bullets = [];
    }

    /**
     * Add a new bullet at specified position
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    add(x, y) {
        this.bullets.push(new Bullet(x, y));
    }

    /**
     * Update all bullets
     */
    updateAll() {
        for (let bullet of this.bullets) {
            if (bullet.active) {
                bullet.update();
            }
        }
    }

    /**
     * Draw all bullets
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    drawAll(ctx) {
        for (let bullet of this.bullets) {
            if (bullet.active) {
                bullet.draw(ctx);
            }
        }
    }

    /**
     * Remove inactive bullets from array
     */
    removeInactive() {
        this.bullets = this.bullets.filter(bullet => bullet.active);
    }

    /**
     * Check collisions between bullets and alien grid
     * @param {AlienGrid} alienGrid - The alien grid to check collisions with
     * @returns {Array} Array of hit aliens
     */
    checkCollisions(alienGrid) {
        const hitAliens = [];

        for (let bullet of this.bullets) {
            if (!bullet.active) continue;

            // Check collision with each alien in the grid
            if (alienGrid && alienGrid.aliens) {
                for (let alien of alienGrid.aliens) {
                    if (!alien.active) continue;

                    // Simple AABB collision detection
                    if (bullet.x < alien.x + alien.width &&
                        bullet.x + bullet.width > alien.x &&
                        bullet.y < alien.y + alien.height &&
                        bullet.y + bullet.height > alien.y) {

                        // Mark both bullet and alien as inactive
                        bullet.active = false;
                        alien.active = false;
                        hitAliens.push(alien);
                        break; // Bullet can only hit one alien
                    }
                }
            }
        }

        return hitAliens;
    }
}
