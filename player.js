/**
 * Player class - handles player ship rendering and movement
 */
export class Player {
  constructor(canvasWidth, canvasHeight) {
    // Ship dimensions
    this.width = 40;
    this.height = 30;

    // Starting position - bottom center
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 20; // 20px padding from bottom

    // Movement properties
    this.speed = 5;
    this.dx = 0; // Horizontal velocity

    // Canvas boundaries
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Visual properties
    this.color = '#00FF00';
    this.glowBlur = 10;
  }

  /**
   * Update player position based on velocity
   */
  update() {
    // Update horizontal position
    this.x += this.dx;

    // Apply boundary constraints - keep ship within canvas edges
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.canvasWidth) {
      this.x = this.canvasWidth - this.width;
    }
  }

  /**
   * Render player ship as retro green triangle with glow effect
   */
  draw(ctx) {
    // Save context state
    ctx.save();

    // Apply glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.glowBlur;

    // Draw triangle ship
    ctx.fillStyle = this.color;
    ctx.beginPath();

    // Triangle points: top center, bottom left, bottom right
    const centerX = this.x + this.width / 2;
    const top = this.y;
    const bottom = this.y + this.height;
    const left = this.x;
    const right = this.x + this.width;

    ctx.moveTo(centerX, top);           // Top point (nose of ship)
    ctx.lineTo(left, bottom);           // Bottom left
    ctx.lineTo(right, bottom);          // Bottom right
    ctx.closePath();

    ctx.fill();

    // Restore context state
    ctx.restore();
  }

  /**
   * Move player left
   */
  moveLeft() {
    this.dx = -this.speed;
  }

  /**
   * Move player right
   */
  moveRight() {
    this.dx = this.speed;
  }

  /**
   * Stop horizontal movement
   */
  stop() {
    this.dx = 0;
  }

  /**
   * Get player bounds for collision detection
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
