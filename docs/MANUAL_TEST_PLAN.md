# Space Invaders - Manual Test Plan

**Version:** 1.0
**Date:** 2026-03-01
**Tester:** ___________________
**Test Date:** ___________________
**Browser:** ___________________
**Browser Version:** ___________________
**OS:** ___________________

---

## 1. Visual Tests - Retro CRT Aesthetic

### 1.1 Color Scheme
- [ ] Canvas background is black
- [ ] Player ship is rendered in retro green (#00ff00)
- [ ] Aliens are rendered in retro green
- [ ] Bullets are rendered in retro green
- [ ] Shields are rendered in retro green
- [ ] HUD text is retro green
- [ ] All colors maintain consistent retro aesthetic

### 1.2 Animations
- [ ] Player ship moves smoothly left/right
- [ ] Aliens move in synchronized grid formation
- [ ] Aliens shift down when reaching screen edge
- [ ] Bullets travel smoothly up/down
- [ ] Mystery ship flies smoothly across top
- [ ] Frame rate is smooth (target 60 FPS)
- [ ] No visible stuttering or jank

### 1.3 Particle Effects
- [ ] Explosions appear when alien is destroyed
- [ ] Explosions appear when player is hit
- [ ] Explosions appear when mystery ship is destroyed
- [ ] Particles radiate outward from explosion point
- [ ] Particles fade out gradually
- [ ] Particle colors are visible and appropriate

### 1.4 HUD Display
- [ ] Score displays correctly in top-left
- [ ] Lives counter displays correctly
- [ ] Wave number displays correctly
- [ ] Combo counter displays when active
- [ ] Multiplier shows (e.g., "2x", "3x")
- [ ] High score displays correctly
- [ ] All HUD elements are properly aligned
- [ ] Text is readable and properly sized

---

## 2. Gameplay Flow

### 2.1 Start Screen
- [ ] "SPACE INVADERS" title is displayed
- [ ] "Press SPACE to Start" instruction is visible
- [ ] High score is displayed if it exists
- [ ] Controls instructions are shown
- [ ] Pressing SPACE starts the game
- [ ] Screen transitions smoothly to gameplay

### 2.2 Game Loop
- [ ] Game starts with 3 lives
- [ ] Wave 1 begins with proper alien formation
- [ ] Player can immediately control ship
- [ ] Aliens begin moving
- [ ] Aliens begin firing after delay
- [ ] Shields are present and intact
- [ ] Score starts at 0
- [ ] Game time progresses smoothly

### 2.3 Game Over Screen
- [ ] "GAME OVER" message displays when all lives lost
- [ ] Final score is shown
- [ ] High score updates if beaten
- [ ] "Press SPACE to Restart" instruction appears
- [ ] Pressing SPACE restarts game
- [ ] Game state resets completely on restart

### 2.4 Victory/Wave Complete Screen
- [ ] Wave complete message appears when all aliens destroyed
- [ ] Score is preserved
- [ ] Lives are preserved
- [ ] Shields regenerate for next wave
- [ ] Next wave starts with increased difficulty
- [ ] Wave number increments correctly

---

## 3. Controls

### 3.1 Arrow Keys
- [ ] Left arrow moves player left
- [ ] Right arrow moves player right
- [ ] Player stops when key released
- [ ] Movement is smooth and responsive
- [ ] No delay in input response

### 3.2 WASD Keys
- [ ] A key moves player left
- [ ] D key moves player right
- [ ] Player stops when key released
- [ ] Movement is smooth and responsive
- [ ] Works simultaneously with arrow keys

### 3.3 Spacebar (Shooting)
- [ ] Spacebar fires bullet upward
- [ ] Cannot fire if bullet already exists
- [ ] Bullet spawns from player position
- [ ] Shooting works while moving
- [ ] Rapid presses queue properly

### 3.4 Pause Functionality
- [ ] P key pauses the game
- [ ] ESC key pauses the game
- [ ] "PAUSED" overlay appears
- [ ] All game elements freeze
- [ ] P or ESC unpauses the game
- [ ] Game resumes from exact state
- [ ] Sound effects pause/resume correctly

---

## 4. Game Mechanics

### 4.1 Player Movement
- [ ] Player ship moves left/right within screen bounds
- [ ] Cannot move beyond left edge
- [ ] Cannot move beyond right edge
- [ ] Movement speed feels appropriate
- [ ] Diagonal movement not possible (as expected)

### 4.2 Player Shooting
- [ ] Only one player bullet can exist at a time
- [ ] Bullet fires from center of player ship
- [ ] Bullet travels upward at consistent speed
- [ ] Bullet disappears at screen top
- [ ] Can fire again after previous bullet clears

### 4.3 Alien Movement Patterns
- [ ] Aliens start in proper grid formation (11 columns x 5 rows)
- [ ] All aliens move together as a unit
- [ ] Aliens move right, drop down, then move left
- [ ] Movement speed increases as aliens are destroyed
- [ ] Movement speed increases with each wave
- [ ] Aliens correctly reverse at screen edges

### 4.4 Alien Shooting
- [ ] Aliens fire bullets downward
- [ ] Alien bullets spawn from alien position
- [ ] Multiple alien bullets can exist simultaneously
- [ ] Fire rate increases with wave number
- [ ] Random aliens fire (not always the same one)

### 4.5 Collision Detection - Player Bullets
- [ ] Player bullet destroys alien on hit
- [ ] Player bullet destroys mystery ship on hit
- [ ] Player bullet damages shield on hit
- [ ] Bullet disappears after collision
- [ ] Hit detection is accurate (not too loose/tight)

### 4.6 Collision Detection - Alien Bullets
- [ ] Alien bullet hits player and reduces lives
- [ ] Alien bullet damages shield on hit
- [ ] Alien bullet disappears after collision
- [ ] Hit detection is accurate
- [ ] Player becomes briefly invulnerable after hit

### 4.7 Collision Detection - Aliens
- [ ] Alien reaching bottom of screen = game over
- [ ] Alien-player collision ends game
- [ ] All collision responses are immediate

### 4.8 Shield Erosion
- [ ] Four shields appear at start
- [ ] Shields positioned between player and aliens
- [ ] Shields show classic shape
- [ ] Player bullets erode shields (pixel-based damage)
- [ ] Alien bullets erode shields (pixel-based damage)
- [ ] Shield erosion is visually clear
- [ ] Heavily damaged shields still provide some cover
- [ ] Shields regenerate at start of new wave

---

## 5. Scoring System

### 5.1 Points Calculation
- [ ] Different alien rows award different points
- [ ] Top row aliens worth most points
- [ ] Points are added to score immediately
- [ ] Score displays updates in real-time
- [ ] Score persists between waves

### 5.2 Combo System
- [ ] Combo counter appears after consecutive hits
- [ ] Combo increments with each hit
- [ ] Missing a shot resets combo to 0
- [ ] Combo count displays correctly (e.g., "5 COMBO")

### 5.3 Multiplier Display
- [ ] Multiplier activates at 5 combo (2x)
- [ ] Multiplier increases every 5 hits (10 = 3x, 15 = 4x)
- [ ] Multiplier formula: 1 + floor(combo / 5)
- [ ] Multiplier displays next to combo (e.g., "3x")
- [ ] Score increases reflect active multiplier
- [ ] Multiplier resets when combo breaks

### 5.4 Mystery Ship Bonus
- [ ] Mystery ship awards 50-300 points
- [ ] Bonus points are random
- [ ] Points display when mystery ship destroyed
- [ ] Mystery ship points add to total score

### 5.5 High Score
- [ ] High score persists between sessions (localStorage)
- [ ] High score updates when current score exceeds it
- [ ] High score displays on start screen
- [ ] High score displays during gameplay

---

## 6. Difficulty Progression

### 6.1 Wave System
- [ ] Game starts at Wave 1
- [ ] Destroying all aliens advances to next wave
- [ ] Wave number increments correctly
- [ ] Wave number displays in HUD
- [ ] Shields fully regenerate each wave

### 6.2 Speed Increases
- [ ] Alien movement speed increases each wave
- [ ] Alien fire rate increases each wave
- [ ] Speed increase is noticeable but playable
- [ ] Game becomes progressively harder

### 6.3 Starting Position Changes
- [ ] Aliens start slightly lower in later waves
- [ ] Starting position change is gradual
- [ ] Aliens don't start too close to player
- [ ] Difficulty ramp feels balanced

---

## 7. Sound Effects

### 7.1 Player Actions
- [ ] Shooting sound plays when firing
- [ ] Shooting sound is retro/arcade-style
- [ ] Sound timing matches action
- [ ] No audio clipping or distortion

### 7.2 Explosions
- [ ] Explosion sound when alien destroyed
- [ ] Explosion sound when player hit
- [ ] Explosion sound when mystery ship destroyed
- [ ] Each explosion sound is distinct and appropriate

### 7.3 Mystery Ship
- [ ] High-pitched sound when mystery ship appears
- [ ] Mystery ship sound loops while on screen
- [ ] Sound stops when mystery ship destroyed
- [ ] Sound stops when mystery ship exits screen

### 7.4 Game State Sounds
- [ ] Sound plays on game over
- [ ] Sound plays on wave complete (if applicable)
- [ ] All sounds fit retro arcade aesthetic

### 7.5 Audio System
- [ ] Sounds require user interaction to start (browser policy)
- [ ] Multiple sounds can play simultaneously
- [ ] Volume levels are balanced
- [ ] Sounds pause when game paused

---

## 8. Edge Cases

### 8.1 Rapid Fire Testing
- [ ] Holding spacebar doesn't break shooting
- [ ] Spamming spacebar works correctly
- [ ] Only one bullet exists at a time (confirmed)
- [ ] No bullets get "stuck"

### 8.2 Corner Movements
- [ ] Player can shoot from left edge
- [ ] Player can shoot from right edge
- [ ] Player can move while bullet in flight
- [ ] No collision detection issues at edges

### 8.3 Simultaneous Collisions
- [ ] Player bullet + alien bullet hitting shield together
- [ ] Multiple aliens destroyed in quick succession
- [ ] Player hit while destroying alien
- [ ] Mystery ship destroyed at screen edge
- [ ] All events register correctly

### 8.4 Rapid State Changes
- [ ] Pausing/unpausing rapidly
- [ ] Game over -> restart quickly
- [ ] Last alien destroyed + player hit simultaneously
- [ ] Wave complete + player hit timing
- [ ] No state corruption or crashes

### 8.5 Boundary Conditions
- [ ] Score reaching very high values (10000+)
- [ ] Combo reaching high values (50+)
- [ ] Playing for extended time (10+ waves)
- [ ] Losing all lives quickly
- [ ] No memory leaks or performance degradation

---

## 9. Browser Compatibility

### 9.1 Chrome/Chromium
- [ ] Game loads without errors
- [ ] All visual elements render correctly
- [ ] Controls respond properly
- [ ] Sound effects work
- [ ] Performance is smooth
- [ ] localStorage persists high score

### 9.2 Firefox
- [ ] Game loads without errors
- [ ] All visual elements render correctly
- [ ] Controls respond properly
- [ ] Sound effects work
- [ ] Performance is smooth
- [ ] localStorage persists high score

### 9.3 Safari
- [ ] Game loads without errors
- [ ] All visual elements render correctly
- [ ] Controls respond properly
- [ ] Sound effects work
- [ ] Performance is smooth
- [ ] localStorage persists high score

### 9.4 Edge (Chromium)
- [ ] Game loads without errors
- [ ] All visual elements render correctly
- [ ] Controls respond properly
- [ ] Sound effects work
- [ ] Performance is smooth
- [ ] localStorage persists high score

### 9.5 Mobile Browsers (Bonus)
- [ ] Game displays on mobile screen
- [ ] Canvas scales appropriately
- [ ] Note: Touch controls not implemented (expected limitation)

---

## 10. Test Results Summary

**Total Tests:** _______
**Tests Passed:** _______
**Tests Failed:** _______
**Pass Rate:** _______%

### Critical Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Minor Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Additional Notes
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________

### Overall Assessment
- [ ] Game is ready for release
- [ ] Game needs minor fixes
- [ ] Game needs major fixes
- [ ] Game is not ready for release

**Tester Signature:** ___________________
**Date Completed:** ___________________

---

## Appendix: Test Environment Setup

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- localStorage enabled
- Web Audio API supported
- Screen resolution: Minimum 1024x768

### Setup Steps
1. Clone or download the repository
2. Open `index.html` in web browser
3. Ensure sound is enabled in browser
4. Click anywhere to enable audio (browser autoplay policy)
5. Begin testing from start screen

### Reset Instructions
- **Clear High Score:** Open browser DevTools > Application > localStorage > Clear
- **Reset Game:** Refresh page (F5 or Cmd+R)
- **Clear Browser Cache:** Use browser settings if assets don't update

---

**End of Manual Test Plan**
