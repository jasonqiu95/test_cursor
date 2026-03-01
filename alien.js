/**
 * Alien types with colors and point values
 */
export const AlienTypes = {
  TYPE_A: {
    color: '#00FF00',
    points: 30,
    pattern: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1]
    ]
  },
  TYPE_B: {
    color: '#00DD00',
    points: 20,
    pattern: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 0, 1, 0, 1]
    ]
  },
  TYPE_C: {
    color: '#00BB00',
    points: 10,
    pattern: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 0, 1, 1]
    ]
  }
};

/**
 * Alien class representing individual alien entities
 */
export class Alien {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = AlienTypes[type] || AlienTypes.TYPE_C;
    this.typeName = type;
    this.alive = true;
    this.width = 8;
    this.height = 8;
    this.animationFrame = 0;
  }

  /**
   * Draw the alien sprite
   */
  draw(ctx, animationFrame = 0) {
    if (!this.alive) return;

    const pattern = this.type.pattern;
    const pixelSize = 1;

    ctx.fillStyle = this.type.color;

    // Apply slight animation offset based on frame
    const offsetX = animationFrame % 2 === 0 ? 0 : 0.5;

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === 1) {
          ctx.fillRect(
            this.x + col * pixelSize + offsetX,
            this.y + row * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }

  /**
   * Get alien bounds for collision detection
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Check if alien collides with given bounds
   */
  collidesWith(x, y, width, height) {
    if (!this.alive) return false;

    return (
      this.x < x + width &&
      this.x + this.width > x &&
      this.y < y + height &&
      this.y + this.height > y
    );
  }

  /**
   * Destroy the alien
   */
  destroy() {
    this.alive = false;
  }

  /**
   * Get point value of this alien
   */
  getPoints() {
    return this.type.points;
  }
}

/**
 * AlienGrid class managing a 2D grid of aliens
 */
export class AlienGrid {
  constructor(startX = 50, startY = 50, difficultyMultiplier = 1) {
    this.startX = startX;
    this.startY = startY;
    this.aliens = [];
    this.direction = 1; // 1 for right, -1 for left
    this.difficultyMultiplier = difficultyMultiplier;

    // Base values - modified by difficulty
    this.baseSpeed = 20;
    this.baseShootCooldown = 1000;
    this.baseShootChance = 0.3;

    // Apply difficulty scaling
    this.speed = this.baseSpeed * (1 + (difficultyMultiplier - 1) * 0.3); // 30% speed increase per wave
    this.shootCooldown = Math.max(300, this.baseShootCooldown / difficultyMultiplier); // Faster shooting, min 300ms
    this.shootChance = Math.min(0.8, this.baseShootChance + (difficultyMultiplier - 1) * 0.1); // More frequent shooting, max 80%

    this.descentAmount = 10;
    this.rows = 5;
    this.columns = 11;
    this.spacingX = 12;
    this.spacingY = 12;
    this.animationTime = 0;
    this.animationFrame = 0;
    this.animationInterval = 500; // milliseconds between animation frames
    this.shootTimer = 0;

    this.initializeGrid();
  }

  /**
   * Initialize the alien grid
   */
  initializeGrid() {
    this.aliens = [];

    for (let row = 0; row < this.rows; row++) {
      const alienRow = [];

      // Determine alien type based on row
      let alienType;
      if (row === 0) {
        alienType = 'TYPE_A';
      } else if (row === 1 || row === 2) {
        alienType = 'TYPE_B';
      } else {
        alienType = 'TYPE_C';
      }

      for (let col = 0; col < this.columns; col++) {
        const x = this.startX + col * this.spacingX;
        const y = this.startY + row * this.spacingY;
        const alien = new Alien(x, y, alienType);
        alienRow.push(alien);
      }

      this.aliens.push(alienRow);
    }
  }

  /**
   * Update alien positions and animation
   */
  update(deltaTime) {
    // Update animation frame
    this.animationTime += deltaTime;
    if (this.animationTime >= this.animationInterval) {
      this.animationTime = 0;
      this.animationFrame = (this.animationFrame + 1) % 2;
    }

    // Move aliens horizontally
    const shouldDescend = this.shouldDescend();

    if (shouldDescend) {
      this.descend();
      this.direction *= -1; // Reverse direction
    } else {
      this.moveHorizontal();
    }
  }

  /**
   * Move aliens horizontally
   */
  moveHorizontal() {
    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        const alien = this.aliens[row][col];
        if (alien.alive) {
          alien.x += this.speed * this.direction * 0.016; // Assuming ~60fps
        }
      }
    }
  }

  /**
   * Check if aliens should descend (hit edge)
   */
  shouldDescend() {
    const bounds = this.getGridBounds();

    if (this.direction > 0) {
      // Moving right - check right edge
      return bounds.right >= 800 - 20; // Canvas width minus margin
    } else {
      // Moving left - check left edge
      return bounds.left <= 20; // Margin
    }
  }

  /**
   * Descend aliens vertically
   */
  descend() {
    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        const alien = this.aliens[row][col];
        if (alien.alive) {
          alien.y += this.descentAmount;
        }
      }
    }
  }

  /**
   * Get overall grid bounds
   */
  getGridBounds() {
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;

    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        const alien = this.aliens[row][col];
        if (alien.alive) {
          left = Math.min(left, alien.x);
          right = Math.max(right, alien.x + alien.width);
          top = Math.min(top, alien.y);
          bottom = Math.max(bottom, alien.y + alien.height);
        }
      }
    }

    return { left, right, top, bottom };
  }

  /**
   * Draw all aliens
   */
  draw(ctx) {
    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        const alien = this.aliens[row][col];
        alien.draw(ctx, this.animationFrame);
      }
    }
  }

  /**
   * Check collision with all aliens
   */
  checkCollision(x, y, width, height) {
    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        const alien = this.aliens[row][col];
        if (alien.collidesWith(x, y, width, height)) {
          const points = alien.getPoints();
          alien.destroy();
          return { hit: true, points, alien };
        }
      }
    }
    return { hit: false, points: 0, alien: null };
  }

  /**
   * Check if all aliens are destroyed
   */
  allDestroyed() {
    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        if (this.aliens[row][col].alive) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Reset the grid
   */
  reset() {
    this.direction = 1;
    this.animationTime = 0;
    this.animationFrame = 0;
    this.shootTimer = 0;
    this.initializeGrid();
  }

  /**
   * Reset the grid with new difficulty
   */
  resetWithDifficulty(difficultyMultiplier) {
    this.difficultyMultiplier = difficultyMultiplier;

    // Recalculate difficulty-based parameters
    this.speed = this.baseSpeed * (1 + (difficultyMultiplier - 1) * 0.3);
    this.shootCooldown = Math.max(300, this.baseShootCooldown / difficultyMultiplier);
    this.shootChance = Math.min(0.8, this.baseShootChance + (difficultyMultiplier - 1) * 0.1);

    this.reset();
  }

  /**
   * Get count of remaining aliens
   */
  getRemainingCount() {
    let count = 0;
    for (let row = 0; row < this.aliens.length; row++) {
      for (let col = 0; col < this.aliens[row].length; col++) {
        if (this.aliens[row][col].alive) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Get the bottom-most living alien in each column
   */
  getBottomAliens() {
    const bottomAliens = [];

    for (let col = 0; col < this.columns; col++) {
      // Start from bottom row and work up
      for (let row = this.rows - 1; row >= 0; row--) {
        const alien = this.aliens[row][col];
        if (alien.alive) {
          bottomAliens.push(alien);
          break; // Found bottom alien in this column
        }
      }
    }

    return bottomAliens;
  }

  /**
   * Attempt to shoot from random bottom aliens
   * Returns an array of positions for bullet creation or null
   */
  shoot(deltaTime) {
    this.shootTimer += deltaTime;

    // Check if cooldown has passed
    if (this.shootTimer < this.shootCooldown) {
      return null;
    }

    // Check shoot chance
    if (Math.random() > this.shootChance) {
      this.shootTimer = 0; // Reset timer even if not shooting
      return null;
    }

    // Get bottom aliens that can shoot
    const bottomAliens = this.getBottomAliens();

    if (bottomAliens.length === 0) {
      return null;
    }

    // Calculate number of aliens that should shoot based on difficulty
    // Wave 1: 1 alien, Wave 2: 1-2 aliens, Wave 3+: 1-3 aliens
    const maxShooters = Math.min(3, Math.floor(this.difficultyMultiplier / 2) + 1);
    const numShooters = Math.min(maxShooters, bottomAliens.length);

    // Randomly select aliens to shoot
    const shootingPositions = [];
    const shuffled = [...bottomAliens].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numShooters; i++) {
      const shootingAlien = shuffled[i];
      shootingPositions.push({
        x: shootingAlien.x + shootingAlien.width / 2,
        y: shootingAlien.y + shootingAlien.height
      });
    }

    // Reset timer
    this.shootTimer = 0;

    // Return array of positions for bullet creation
    return shootingPositions;
  }
}
