/**
 * Bullet class - represents a single projectile
 */
export class Bullet {
    constructor(x, y, direction = 'up') {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = direction === 'down' ? 5 : -5; // Positive for downward, negative for upward
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
     * Draw bullet with color based on direction
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // Set colors based on direction
        const color = this.direction === 'down' ? '#FF4500' : '#00FF00'; // Red/orange for down, green for up
        const glowColor = this.direction === 'down' ? '#FFD700' : '#00FF00'; // Yellow glow for down

        // Outer glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;

        // Draw bullet
        ctx.fillStyle = color;
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
        if (this.direction === 'down') {
            return this.y > canvasHeight;
        } else {
            return this.y + this.height < 0;
        }
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
     * @param {string} direction - Direction of bullet ('up' or 'down')
     */
    add(x, y, direction = 'up') {
        this.bullets.push(new Bullet(x, y, direction));
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
