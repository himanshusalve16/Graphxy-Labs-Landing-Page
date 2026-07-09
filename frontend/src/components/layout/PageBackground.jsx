import React from 'react';

/**
 * PageBackground — Shared background component for every page/section.
 *
 * Renders the unified engineering mesh grid overlay.
 * • 24×24px grid cells
 * • #808080 lines at 13% opacity (#80808021)
 * • pointer-events-none, absolute inset-0
 * • No radial glow blobs — the mesh is the sole background element
 *
 * Usage:
 *   <div className="relative overflow-hidden">
 *     <PageBackground />
 *     <div className="relative z-10">...content...</div>
 *   </div>
 */
export default function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, #80808021 1px, transparent 1px), linear-gradient(to bottom, #80808021 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}
