// Mobile-specific entry point: wraps original logic but adapts layout for narrow viewports.
// We reuse most of the original code by importing shared modules and overriding layout calculations.
import './main'; // import existing game logic (executes and attaches to #app-root)

// After original script runs, we tweak layout for mobile responsiveness.
// NOTE: Original code created global containers on window; we access them via (window as any).
const wAny = window as any;

function applyMobileLayout(){
  const app = wAny.app as import('pixi.js').Application | undefined;
  if (!app) return;
  // Force scale so full game fits vertically; use device width to scale grid.
  const targetWidth = app.renderer.width;
  const targetHeight = app.renderer.height;
  // We detect the centerContainer etc. from globals if exposed.
  const center = wAny.centerContainer as import('pixi.js').Container | undefined;
  const left = wAny.leftContainer as import('pixi.js').Container | undefined;
  const right = wAny.rightContainer as import('pixi.js').Container | undefined;
  if (!center || !left || !right) return;

  // Compact mode threshold
  const compact = targetWidth < 640 || targetHeight < 780;
  if (!compact){
    // Let original layout persist
    return;
  }
  // New arrangement:
  // Row 1 (top): animal grid full width (center)
  // Row 2: ticket panel (left) horizontally scroll if too wide, next to result slots (right) side by side collapsed.
  // We'll stack ticket panel and result slots underneath grid in a horizontal flex-like arrangement using manual positioning.
  const margin = 8;
  const gridScale = Math.min(1, targetWidth / (center.width + 40));
  center.scale.set(gridScale);
  center.x = (targetWidth - center.width)/2;
  center.y = margin + 6;

  // Reduce widths for panels
  const panelTotalWidth = targetWidth - margin*2;
  const singlePanelWidth = Math.max(180, Math.min(220, panelTotalWidth/2 - margin/2));
  // Left (tickets)
  left.x = margin;
  left.y = center.y + center.height + margin;
  // Right (results)
  right.x = left.x + singlePanelWidth + margin;
  right.y = left.y;
  // Scale down right panel if needed
  const panelScale = Math.min(1, (singlePanelWidth) / right.width);
  right.scale.set(panelScale);
  // Constrain left container width via scale
  const leftScale = Math.min(1, (singlePanelWidth) / left.width);
  left.scale.set(leftScale);

  // If vertical space tight, enable internal scroll: shrink ticket panel height
  const availableHeight = targetHeight - left.y - 120; // leave space for bottom mobile bar
  if (availableHeight < left.height){
    // We can clip the ticket panel by cropping its mask height if available
    // Original code sets mask inside buildLeftSpacer; here we adjust container scale slightly
    const scaleY = Math.min(1, availableHeight / left.height);
    left.scale.y = left.scale.x * scaleY; // maintain aspect horizontally
  }
}

window.addEventListener('resize', applyMobileLayout);
setTimeout(applyMobileLayout, 50);
