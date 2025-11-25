// Mobile-specific entry point: wraps original logic but adapts layout for narrow viewports.
// We reuse most of the original code by importing shared modules and overriding layout calculations.
import './main'; // import existing game logic (executes and attaches to #app-root)

// After original script runs, we tweak layout for mobile responsiveness.
// NOTE: Original code created global containers on window; we access them via (window as any).
const wAny = window as any;

function activateMobileMode(){
  if (typeof wAny.setMobileMode === 'function'){
    wAny.setMobileMode(true);
  }
}
window.addEventListener('resize', activateMobileMode);
setTimeout(activateMobileMode, 20);
