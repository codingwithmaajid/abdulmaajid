<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  // Animation constants from the original Java code
  const FRAME_COUNT = 32;
  const CAT_SIZE = 64; // Original images are 64x64
  const TRIGGER_DIST = 64;
  const CATCH_DIST = 16;
  const RUN_DIST = 16;
  const LOAD_DELAY = 100;
  const RUN_DELAY = 200;
  const SIT_DELAY = 400;
  const SHARPEN_DELAY = 200;
  const SCRATCH_DELAY = 300;
  const YAWN_DELAY = 500;
  const SLEEP_DELAY = 1000;
  const SURPRISE_DELAY = 500;

  // States
  const STATE_INIT = 0;
  const STATE_CHASE = 1;
  const STATE_SLEEP = 2;
  const STATE_SURPRISE = 3;

  // Position enums
  const POS_OVER = 0;
  const POS_UNDER = 1;
  const POS_LEFT = 2;
  const POS_RIGHT = 3;

  let canvas;
  let ctx;
  let frames = [];
  let frameLoaded = 0;

  // Cat state
  let ox = 0; // cat x position (screen coordinates)
  let oy = 0; // cat y position (screen coordinates)
  let no = 0; // current frame number
  let state = STATE_INIT;
  let slp = 0; // sleep timer
  let init = 0; // initialization counter
  let ilc1 = 0; // image loop counter 1
  let ilc2 = 0; // image loop counter 2
  let mouseMoved = false;
  let mouseX = 0;
  let mouseY = 0;
  let animationId = null;

  // Window bounds for the cat to roam
  let bounds = { x: 0, y: 0, width: 0, height: 0 };

  const PI = Math.PI;

  function loadFrames() {
    return new Promise((resolve) => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `/images/neko/${i}.GIF`;
        img.onload = () => {
          frames[i] = img;
          frameLoaded++;
          if (frameLoaded === FRAME_COUNT) {
            // frame 0 is a copy of frame 25 (per original code)
            frames[0] = frames[25];
            resolve();
          }
        };
        img.onerror = () => {
          console.error(`Failed to load frame ${i}`);
          frameLoaded++;
          if (frameLoaded === FRAME_COUNT) {
            frames[0] = frames[25];
            resolve();
          }
        };
      }
    });
  }

  function calculateBounds() {
    if (!browser) return;
    const padding = CAT_SIZE / 2;
    bounds = {
      x: padding,
      y: CAT_SIZE,
      width: window.innerWidth - padding - CAT_SIZE,
      height: window.innerHeight - CAT_SIZE * 2
    };

    // Initialize cat position at center
    if (ox === 0 && oy === 0) {
      ox = bounds.x + bounds.width / 2;
      oy = bounds.y + bounds.height / 2;
    }
  }

  function getMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animate() {
    if (!browser) return;
    if (frames.length === 0 || !frames[1]) return;

    // Determine target position (mouse clamped to bounds)
    let targetX = mouseX;
    let targetY = mouseY;
    let pos = null;
    let out = false;

    if (mouseX < bounds.x) {
      targetX = bounds.x;
      pos = POS_LEFT;
      out = true;
    }
    if (mouseX > bounds.x + bounds.width) {
      targetX = bounds.x + bounds.width;
      pos = POS_RIGHT;
      out = true;
    }
    if (mouseY < bounds.y) {
      targetY = bounds.y;
      pos = POS_OVER;
      out = true;
    }
    if (mouseY > bounds.y + bounds.height) {
      targetY = bounds.y + bounds.height;
      pos = POS_UNDER;
      out = true;
    }

    // Distance from cat to target
    const dx = targetX - ox;
    const dy = oy - targetY; // inverted Y for atan2
    const dist = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan2(dy, dx);

    // Wake up if mouse moved far enough
    mouseMoved = mouseMoved || dist > TRIGGER_DIST;

    // Decrease sleep timer
    slp = Math.max(0, slp - 50); // timer runs at ~50ms intervals

    if (slp === 0) {
      animateCat(pos, theta, dist);
    }

    // Draw current frame
    drawCat();

    animationId = requestAnimationFrame(animate);
  }

  function animateCat(pos, theta, dist) {
    let doMove = false;

    if (state === STATE_INIT) {
      if (init < 33) {
        doMove = true;
        slp = LOAD_DELAY;
        ox = bounds.x + bounds.width / 2;
        oy = bounds.y + bounds.height / 2;
        no = init;
        init++;
      } else {
        state = STATE_CHASE;
      }
    } else if (state === STATE_CHASE) {
      doMove = true;
      slp = RUN_DELAY;

      let run = RUN_DIST;
      if (run > dist) run = dist;

      ox = Math.round(ox + Math.cos(theta) * run);
      oy = Math.round(oy - Math.sin(theta) * run);
      dist -= run;

      if (dist < CATCH_DIST) {
        state = STATE_SLEEP;
      }

      // Determine frame based on direction (8-way)
      if (theta >= -PI / 8 && theta <= PI / 8) { // right
        no = (no === 5) ? 6 : 5;
      } else if (theta > PI / 8 && theta < 3 * PI / 8) { // up-right
        no = (no === 3) ? 4 : 3;
      } else if (theta >= 3 * PI / 8 && theta <= 5 * PI / 8) { // up
        no = (no === 1) ? 2 : 1;
      } else if (theta > 5 * PI / 8 && theta < 7 * PI / 8) { // up-left
        no = (no === 15) ? 16 : 15;
      } else if (theta >= 7 * PI / 8 || theta <= -7 * PI / 8) { // left
        no = (no === 13) ? 14 : 13;
      } else if (theta > -7 * PI / 8 && theta < -5 * PI / 8) { // down-left
        no = (no === 11) ? 12 : 11;
      } else if (theta >= -5 * PI / 8 && theta <= -3 * PI / 8) { // down
        no = (no === 9) ? 10 : 9;
      } else if (theta > -3 * PI / 8 && theta < -PI / 8) { // down-right
        no = (no === 7) ? 8 : 7;
      }

      mouseMoved = false;
    } else {
      // Sleep/Idle states
      switch (no) {
        case 0: // cat sit
          if (pos !== null) {
            slp = SHARPEN_DELAY;
            switch (pos) {
              case POS_OVER: no = 17; break;
              case POS_UNDER: no = 21; break;
              case POS_LEFT: no = 23; break;
              case POS_RIGHT: no = 19; break;
            }
            break;
          }
          slp = SIT_DELAY;
          no = 31;
          break;

        case 17: // sharpening claws up
        case 18:
          slp = SHARPEN_DELAY;
          no = (no === 17) ? 18 : 17;
          ilc1++;
          if (ilc1 >= 6) { no = 27; ilc1 = 0; }
          break;

        case 21: // sharpening claws down
        case 22:
          slp = SHARPEN_DELAY;
          no = (no === 21) ? 22 : 21;
          ilc1++;
          if (ilc1 >= 6) { no = 27; ilc1 = 0; }
          break;

        case 23: // sharpening claws left
        case 24:
          slp = SHARPEN_DELAY;
          no = (no === 23) ? 24 : 23;
          ilc1++;
          if (ilc1 >= 6) { no = 27; ilc1 = 0; }
          break;

        case 19: // sharpening claws right
        case 20:
          slp = SHARPEN_DELAY;
          no = (no === 19) ? 20 : 19;
          ilc1++;
          if (ilc1 >= 6) { no = 27; ilc1 = 0; }
          break;

        case 31: // cat lick
          slp = SIT_DELAY;
          no = 25;
          ilc1++;
          if (ilc1 >= 6) { slp = SCRATCH_DELAY; no = 27; ilc1 = 0; }
          break;

        case 25: // cat lick alt
          slp = SIT_DELAY;
          no = 31;
          break;

        case 27: // cat scratch
          slp = SCRATCH_DELAY;
          no = 28;
          break;

        case 28: // cat scratch alt
          no = 27;
          ilc2++;
          if (ilc2 >= 4) { no = 26; slp = YAWN_DELAY; ilc2 = 0; }
          break;

        case 26: // cat yawn
          no = 29;
          slp = SLEEP_DELAY;
          break;

        case 29: // cat sleep
        case 30:
          slp = SLEEP_DELAY;
          no = (no === 29) ? 30 : 29;
          break;

        default:
          no = 0;
          break;
      }

      // Wake up if mouse moved
      if (mouseMoved) {
        slp = SURPRISE_DELAY;
        no = 32;
        ilc1 = 0;
        ilc2 = 0;
        state = STATE_CHASE;
      }
    }

    if (doMove) {
      // Cat position already updated in chase state
    }
  }

  function drawCat() {
    if (!browser || !ctx || !frames[no]) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[no], ox - CAT_SIZE / 2, oy - CAT_SIZE / 2, CAT_SIZE, CAT_SIZE);
  }

  function handleResize() {
    if (!browser) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateBounds();
  }

  onMount(async () => {
    if (!browser) return;
    
    await loadFrames();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    calculateBounds();

    window.addEventListener('mousemove', getMousePosition);
    window.addEventListener('resize', handleResize);

    animate();
  });

  onDestroy(() => {
    if (!browser) return;
    window.removeEventListener('mousemove', getMousePosition);
    window.removeEventListener('resize', handleResize);
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

{#if browser}
<div class="neko-container" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999;">
  <canvas bind:this={canvas} style="width: 100%; height: 100%;"></canvas>
</div>
{/if}

<style>
  .neko-container {
    /* Allow clicks to pass through */
    pointer-events: none;
  }
</style>