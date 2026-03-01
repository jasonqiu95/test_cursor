# Space Invaders - Retro Arcade Classic

A faithful recreation of the classic Space Invaders arcade game, built with modern web technologies. Battle waves of alien invaders, build up combo multipliers, and compete for the high score!

## Features

This enhanced version includes 8 major improvements over the classic game:

1. **High Score Persistence** - Your best score is saved locally and persists between sessions
2. **Combo Multiplier System** - Chain consecutive hits to build up score multipliers (every 5 hits = +1x multiplier)
3. **Progressive Difficulty** - Face increasingly challenging waves of aliens with improved AI and speed
4. **Defensive Shields** - Four protective barriers that erode with damage, providing strategic cover
5. **Mystery Ship Bonuses** - Rare UFOs fly across the top of the screen offering 50-300 bonus points
6. **Pause Functionality** - Take a break anytime with P or ESC keys
7. **Retro Sound Effects** - Authentic arcade sounds using the Web Audio API
8. **Particle Effects** - Visual explosions and effects for enhanced gameplay feedback

## How to Play

### Getting Started

1. Open `index.html` in a modern web browser
2. Press **SPACE** to start the game
3. Defend Earth from the alien invasion!

### Controls

| Key | Action |
|-----|--------|
| **Arrow Keys** or **WASD** | Move your ship left and right |
| **SPACE** | Fire your weapon |
| **P** or **ESC** | Pause/unpause the game |

### Objective

- Destroy all alien invaders before they reach the bottom of the screen
- Protect your ship from enemy fire using shields
- Survive multiple waves of increasingly difficult enemies
- Build combos by hitting consecutive targets without missing
- Aim for the high score!

## Gameplay Mechanics

### Scoring System

- **Standard Aliens**: Base points vary by alien type (top row = more points)
- **Combo Multiplier**: Hit 5 enemies in a row without missing to increase your multiplier by 1x
  - Example: At 10-combo streak, your multiplier is 3x (1 + floor(10/5))
- **Mystery Ships**: Worth 50-300 bonus points (random value)
- **Combos Reset**: Missing a shot resets your combo streak to 0

### Shield Mechanics

- Four protective barriers positioned between you and the aliens
- Shields use pixel-based erosion - they gradually degrade when hit
- Shields block both your bullets and enemy fire
- Destroyed shields do not regenerate during a wave
- Strategic positioning behind shields is key to survival

### Wave System

- Complete a wave by destroying all aliens
- Each new wave increases:
  - Alien movement speed
  - Fire rate
  - Starting position (aliens begin slightly lower)
- Shields reset to full strength at the start of each wave

### Mystery Ships

- Red UFO that occasionally flies across the top of the screen
- Appears randomly every 10-20 seconds
- Flies either left-to-right or right-to-left
- Awards 50, 100, 150, 200, 250, or 300 bonus points when destroyed
- Listen for the distinctive high-pitched sound when it appears!

### Alien Behavior

- Aliens move in a grid formation, shifting left and right
- Movement speed increases as you destroy more aliens
- Aliens periodically drop down one row
- Aliens fire bullets downward at random intervals
- If any alien reaches the bottom of the screen, it's game over!

### Lives and Game Over

- You start with 3 lives
- Lose a life when hit by alien fire
- Game ends when you lose all lives or aliens reach the bottom
- Press SPACE at the game over screen to restart

## Technical Details

### Technology Stack

- **HTML5 Canvas** - For rendering all game graphics
- **Vanilla JavaScript** - No frameworks or libraries required
- **ES6 Modules** - Clean, modular code architecture
- **Web Audio API** - Retro arcade sound effects
- **localStorage** - Persistent high score tracking

### Performance

- Target frame rate: **60 FPS**
- Uses `requestAnimationFrame` for smooth animation
- Delta time calculations ensure consistent gameplay across different devices
- Responsive canvas scaling maintains aspect ratio on all screen sizes
- Optimized collision detection for bullets, aliens, shields, and player

### Browser Requirements

- Modern browser with HTML5 Canvas support (Chrome, Firefox, Safari, Edge)
- JavaScript ES6 module support
- Web Audio API support (for sound effects)
- localStorage enabled (for high score persistence)

## Project Structure

```
├── index.html          # Entry point - sets up canvas and loads game
├── style.css           # Styling for canvas container and layout
├── game.js             # Main game loop, state management, and core systems
│                       #   - Game state machine
│                       #   - Sound manager
│                       #   - Mystery ship logic
│                       #   - Particle effects
│                       #   - High score persistence
│                       #   - Collision detection
│                       #   - Wave management
├── player.js           # Player ship class
│                       #   - Movement controls
│                       #   - Rendering (green triangle ship)
│                       #   - Boundary detection
├── alien.js            # Alien enemy classes
│                       #   - Individual alien behavior
│                       #   - Grid formation management
│                       #   - Movement patterns
│                       #   - Shooting logic
├── bullet.js           # Bullet manager
│                       #   - Player bullets (upward)
│                       #   - Alien bullets (downward)
│                       #   - Lifecycle management
├── shield.js           # Shield/barrier system
│                       #   - Pixel-based erosion
│                       #   - Collision detection
│                       #   - Classic shield shape
├── hud.js              # Heads-up display
│                       #   - Score display
│                       #   - Lives counter
│                       #   - Combo/multiplier indicator
│                       #   - Wave number
│                       #   - Game state messages
│                       #   - Pause overlay
└── input.js            # Input handler
                        #   - Keyboard event management
                        #   - Key state tracking
                        #   - Support for multiple control schemes
```

### File Descriptions

- **game.js** - The heart of the game containing the main game loop, state management, and integration of all systems. Handles timing, collision detection, wave progression, and audio.

- **player.js** - Manages the player's ship including movement, rendering, and boundary checking.

- **alien.js** - Contains the Alien and AlienGrid classes that manage enemy behavior, formation movement, and shooting patterns.

- **bullet.js** - BulletManager class handles all projectiles in the game, both player and alien bullets.

- **hud.js** - Renders all on-screen UI elements including score, lives, combo counter, wave number, and game state messages.

- **input.js** - InputHandler class that provides a clean API for keyboard input, supporting both arrow keys and WASD controls.

- **shield.js** - Implements the classic Space Invaders shields with pixel-based erosion for realistic damage effects.

## Development Notes

### Running Locally

Simply open `index.html` in your browser. No build process, bundler, or server required!

For the best development experience, you can use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# Then open http://localhost:8000
```

### Code Architecture

The game follows object-oriented principles with clear separation of concerns:

- **State Management**: Centralized game state with event-driven updates
- **Module System**: ES6 modules for clean dependency management
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) for performance
- **Visual Effects**: Particle system for explosions and feedback
- **Audio**: Procedurally generated retro sounds using oscillators

### Known Limitations

- Sound effects require user interaction to start (browser autoplay policies)
- Performance may vary on older/slower devices
- Canvas rendering is not hardware-accelerated
- Single-player only (no multiplayer support)

### Potential Enhancements

Ideas for future improvements:

- Power-ups (rapid fire, shields, extra lives)
- Boss battles at certain wave milestones
- Multiple alien types with unique behaviors
- Leaderboard with username entry
- Mobile touch controls
- Game difficulty selection menu

## Tips and Strategies

1. **Master the Combo** - Keep your shots accurate to maintain high multipliers
2. **Use Cover Wisely** - Shields degrade, so don't rely on them indefinitely
3. **Target Speed Threats** - Destroy side aliens first to slow overall grid movement
4. **Watch for Mystery Ships** - Easy bonus points if you're ready
5. **Stay Mobile** - Keep moving to dodge alien fire
6. **Mind the Ceiling** - Don't let combos make you reckless with your shots

## Credits

Built as a tribute to the classic 1978 Space Invaders arcade game by Tomohiro Nishikado.

Developed using modern web technologies while staying true to the retro aesthetic and gameplay that made the original a timeless classic.

## License

This project is provided as-is for educational and entertainment purposes.

---

**High Score:** Your personal best is automatically saved! Can you beat it?

**Ready to defend Earth?** Open `index.html` and press SPACE to begin!
