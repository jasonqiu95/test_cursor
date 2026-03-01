/**
 * Shield class - represents a single destructible barrier
 * Classic Space Invaders style with pixel-based erosion
 */
export class Shield {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 50;
    this.color = '#00FF00';

    // Pixel grid for erosion (1 = solid, 0 = destroyed)
    // Create a classic shield shape
    this.pixelSize = 5; // Size of each "pixel" block
    this.gridWidth = Math.floor(this.width / this.pixelSize);
    this.gridHeight = Math.floor(this.height / this.pixelSize);

    // Initialize the shield shape
    this.grid = this.createShieldShape();
  }

  /**
   * Create the classic Space Invaders shield shape
   * @returns {Array} 2D array representing the shield
   */
  createShieldShape() {
    const grid = [];
    const w = this.gridWidth;
    const h = this.gridHeight;

    // Initialize all cells as solid
    for (let row = 0; row < h; row++) {
      grid[row] = [];
      for (let col = 0; col < w; col++) {
        grid[row][col] = 1;
      }
    }

    // Create the classic curved top and notch at bottom
    // Top curved edges (remove corners)
    if (h > 2 && w > 2) {
      grid[0][0] = 0;
      grid[0][1] = 0;
      grid[0][w - 2] = 0;
      grid[0][w - 1] = 0;
    }

    // Bottom notch (U-shape cutout)
    if (h > 3 && w > 4) {
      const notchWidth = Math.floor(w / 3);
      const notchStart = Math.floor((w - notchWidth) / 2);
      const notchHeight = Math.floor(h / 3);

      for (let row = h - notchHeight; row < h; row++) {
        for (let col = notchStart; col < notchStart + notchWidth; col++) {
          grid[row][col] = 0;
        }
      }
    }

    return grid;
  }

  /**
   * Check if shield is completely destroyed
   * @returns {boolean} True if all pixels are destroyed
   */
  isDestroyed() {
    for (let row = 0; row < this.gridHeight; row++) {
      for (let col = 0; col < this.gridWidth; col++) {
        if (this.grid[row][col] === 1) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check collision with a bullet and erode shield
   * @param {number} bulletX - Bullet x position
   * @param {number} bulletY - Bullet y position
   * @param {number} bulletWidth - Bullet width
   * @param {number} bulletHeight - Bullet height
   * @returns {boolean} True if bullet hit the shield
   */
  checkCollision(bulletX, bulletY, bulletWidth, bulletHeight) {
    // First check basic AABB collision
    if (bulletX + bulletWidth < this.x ||
        bulletX > this.x + this.width ||
        bulletY + bulletHeight < this.y ||
        bulletY > this.y + this.height) {
      return false;
    }

    // Check pixel-level collision
    // Find which grid cells the bullet overlaps
    const startCol = Math.max(0, Math.floor((bulletX - this.x) / this.pixelSize));
    const endCol = Math.min(this.gridWidth - 1, Math.floor((bulletX + bulletWidth - this.x) / this.pixelSize));
    const startRow = Math.max(0, Math.floor((bulletY - this.y) / this.pixelSize));
    const endRow = Math.min(this.gridHeight - 1, Math.floor((bulletY + bulletHeight - this.y) / this.pixelSize));

    let hit = false;

    // Check if any solid pixels were hit
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (this.grid[row][col] === 1) {
          hit = true;
          // Erode the shield - destroy this pixel and neighbors for gradual erosion
          this.erodeAt(row, col);
        }
      }
    }

    return hit;
  }

  /**
   * Erode the shield at a specific grid position
   * @param {number} row - Grid row
   * @param {number} col - Grid column
   */
  erodeAt(row, col) {
    // Destroy the hit pixel
    this.grid[row][col] = 0;

    // Randomly erode some adjacent pixels for realistic erosion
    const neighbors = [
      [row - 1, col], [row + 1, col],
      [row, col - 1], [row, col + 1]
    ];

    for (let [r, c] of neighbors) {
      if (r >= 0 && r < this.gridHeight && c >= 0 && c < this.gridWidth) {
        // 40% chance to erode adjacent pixels
        if (Math.random() < 0.4) {
          this.grid[r][c] = 0;
        }
      }
    }
  }

  /**
   * Draw the shield
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    ctx.save();

    // Draw glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 5;

    ctx.fillStyle = this.color;

    // Draw each solid pixel
    for (let row = 0; row < this.gridHeight; row++) {
      for (let col = 0; col < this.gridWidth; col++) {
        if (this.grid[row][col] === 1) {
          const pixelX = this.x + col * this.pixelSize;
          const pixelY = this.y + row * this.pixelSize;
          ctx.fillRect(pixelX, pixelY, this.pixelSize, this.pixelSize);
        }
      }
    }

    ctx.restore();
  }

  /**
   * Reset shield to full health
   */
  reset() {
    this.grid = this.createShieldShape();
  }
}

/**
 * ShieldManager class - manages all shields in the game
 */
export class ShieldManager {
  constructor(canvasWidth, canvasHeight) {
    this.shields = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Create 4 shields positioned between player and aliens
    this.createShields();
  }

  /**
   * Create shields evenly spaced across the screen
   */
  createShields() {
    const numShields = 4;
    const shieldWidth = 70;
    const spacing = (this.canvasWidth - (numShields * shieldWidth)) / (numShields + 1);
    const shieldY = this.canvasHeight - 150; // Position above player

    for (let i = 0; i < numShields; i++) {
      const x = spacing + i * (shieldWidth + spacing);
      this.shields.push(new Shield(x, shieldY));
    }
  }

  /**
   * Check if any shield collides with a bullet
   * @param {number} bulletX - Bullet x position
   * @param {number} bulletY - Bullet y position
   * @param {number} bulletWidth - Bullet width
   * @param {number} bulletHeight - Bullet height
   * @returns {boolean} True if bullet hit any shield
   */
  checkCollision(bulletX, bulletY, bulletWidth, bulletHeight) {
    for (let shield of this.shields) {
      if (!shield.isDestroyed()) {
        if (shield.checkCollision(bulletX, bulletY, bulletWidth, bulletHeight)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Draw all shields
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    for (let shield of this.shields) {
      if (!shield.isDestroyed()) {
        shield.draw(ctx);
      }
    }
  }

  /**
   * Reset all shields to full health
   */
  reset() {
    for (let shield of this.shields) {
      shield.reset();
    }
  }

  /**
   * Check if all shields are destroyed
   * @returns {boolean} True if all shields are destroyed
   */
  allDestroyed() {
    return this.shields.every(shield => shield.isDestroyed());
  }
}
