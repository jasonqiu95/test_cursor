/**
 * InputHandler - Keyboard input handling system
 * Tracks keyboard state and provides interface for querying key presses
 */
export class InputHandler {
  constructor() {
    // Track the pressed state of relevant game keys
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
      A: false,
      D: false,
      KeyP: false,
      Escape: false
    };

    // Track pause toggle to prevent repeated triggers
    this.pauseToggled = false;

    // Bind event handlers to maintain correct 'this' context
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   * Initialize the input handler by setting up event listeners
   */
  init() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown(event) {
    const key = event.code === 'Space' ? 'Space' : event.code;

    // Only process keys we're tracking
    if (key in this.keys) {
      this.keys[key] = true;

      // Prevent default behavior for game keys to avoid page scrolling
      event.preventDefault();
    }
  }

  /**
   * Handle keyup events
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyUp(event) {
    const key = event.code === 'Space' ? 'Space' : event.code;

    // Only process keys we're tracking
    if (key in this.keys) {
      this.keys[key] = false;

      // Reset pause toggle when key is released
      if (key === 'KeyP' || key === 'Escape') {
        this.pauseToggled = false;
      }

      // Prevent default behavior for game keys to avoid page scrolling
      event.preventDefault();
    }
  }

  /**
   * Check if a specific key is currently pressed
   * @param {string} key - The key to check (e.g., 'ArrowLeft', 'Space', 'A', 'D')
   * @returns {boolean} True if the key is currently pressed
   */
  isKeyPressed(key) {
    return this.keys[key] || false;
  }

  /**
   * Check if left movement keys are pressed (ArrowLeft or A)
   * @returns {boolean} True if left movement is pressed
   */
  isLeftPressed() {
    return this.keys.ArrowLeft || this.keys.A;
  }

  /**
   * Check if right movement keys are pressed (ArrowRight or D)
   * @returns {boolean} True if right movement is pressed
   */
  isRightPressed() {
    return this.keys.ArrowRight || this.keys.D;
  }

  /**
   * Check if shoot key is pressed (Space)
   * @returns {boolean} True if shoot is pressed
   */
  isShootPressed() {
    return this.keys.Space;
  }

  /**
   * Check if pause keys are pressed (P or ESC) and not yet toggled
   * @returns {boolean} True if pause should be toggled
   */
  isPauseToggled() {
    if ((this.keys.KeyP || this.keys.Escape) && !this.pauseToggled) {
      this.pauseToggled = true;
      return true;
    }
    return false;
  }

  /**
   * Clean up event listeners
   * Call this when the input handler is no longer needed
   */
  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    // Reset all keys to unpressed state
    Object.keys(this.keys).forEach(key => {
      this.keys[key] = false;
    });
  }
}
