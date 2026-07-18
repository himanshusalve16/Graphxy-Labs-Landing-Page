import { Grid, Monitor, Smartphone, Cpu, LineChart, Code, GitMerge, Layers, Shield, Cloud, Lock, Database } from 'lucide-react';

// ==============================================================================
// 1. BASE METADATA DEFINITIONS (Single Source of Truth)
// ==============================================================================

export const VERTICALS_METADATA = {
  v0: { name: 'Management Systems', short: 'Mgmt', icon: Grid },
  v1: { name: 'Web Development', short: 'Web Dev', icon: Monitor },
  v2: { name: 'Mobile Applications', short: 'Mobile', icon: Smartphone },
  v3: { name: 'AI & Machine Learning', short: 'AI / ML', icon: Cpu },
  v4: { name: 'Data Engineering', short: 'Data Eng', icon: Database },
  v5: { name: 'Custom Software', short: 'Custom SW', icon: Code },
  v6: { name: 'Automation', short: 'Auto', icon: GitMerge },
  v7: { name: 'Cloud Solutions', short: 'Cloud', icon: Cloud },
  v8: { name: 'Systems Security', short: 'Security', icon: Shield },
};

export const PRODUCTS_METADATA = {
  p_graphzy: {
    name: 'Web Platforms',
    description: 'High-performance web applications and responsive user interfaces.',
    color: '#0066CC',
    link: '/services',
    tag: 'CORE DIVISION',
    connects: ['v1', 'v3', 'v5']
  },
  p_clampbox: {
    name: 'Secure Infrastructure',
    description: 'Confidential cloud execution, robust encryption, and systems security.',
    color: '#0D9488',
    link: '/services',
    tag: 'CORE DIVISION',
    connects: ['v3', 'v6', 'v7', 'v8']
  },
  p_forkline: {
    name: 'Business Automation',
    description: 'Custom operational pipelines, integration layers, and ERP logic.',
    color: '#92400E',
    link: '/services',
    tag: 'CORE DIVISION',
    connects: ['v0', 'v1', 'v6']
  },
  p_lattice: {
    name: 'Data & Analytics',
    description: 'Aggregated analytics dashboards, pipelines, and telemetry systems.',
    color: '#1B3A6B',
    link: '/services',
    tag: 'CORE DIVISION',
    connects: ['v1', 'v4', 'v7']
  }
};

// ==============================================================================
// 2. SCHEMA COMPLIANT ARRAYS (For Scatter and Tree Layouts)
// ==============================================================================

// --- Hero Scatter Graph Nodes (Desktop) — Only 8 official service nodes ---
export const HERO_SCATTER_NODES = [
  // Center
  { id: 'center', label: 'GXY LABS', name: 'GXY LABS', type: 'center', x: 300, y: 190, radius: 28, color: '#1B3A6B', connections: ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'] },
  // 8 Official Service Verticals only
  { id: 'v0', label: 'Management Systems', name: 'Management Systems', type: 'vertical', x: 390, y: 190, radius: 12, color: '#1B3A6B', icon: Grid, connections: ['center'] },
  { id: 'v1', label: 'Web Development', name: 'Web Development', type: 'vertical', x: 364, y: 250, radius: 12, color: '#1B3A6B', icon: Monitor, connections: ['center'] },
  { id: 'v2', label: 'Mobile Applications', name: 'Mobile Applications', type: 'vertical', x: 300, y: 275, radius: 12, color: '#1B3A6B', icon: Smartphone, connections: ['center'] },
  { id: 'v3', label: 'AI & ML', name: 'AI & ML', type: 'vertical', x: 236, y: 250, radius: 12, color: '#1B3A6B', icon: Cpu, connections: ['center'] },
  { id: 'v4', label: 'Data Science', name: 'Data Science & Analytics', type: 'vertical', x: 210, y: 190, radius: 12, color: '#1B3A6B', icon: Database, connections: ['center'] },
  { id: 'v5', label: 'Custom Software', name: 'Custom Software', type: 'vertical', x: 236, y: 130, radius: 12, color: '#1B3A6B', icon: Code, connections: ['center'] },
  { id: 'v6', label: 'Automation', name: 'Automation & Workflow', type: 'vertical', x: 300, y: 105, radius: 12, color: '#1B3A6B', icon: GitMerge, connections: ['center'] },
  { id: 'v7', label: 'Cloud Solutions', name: 'Cloud Solutions', type: 'vertical', x: 364, y: 130, radius: 12, color: '#1B3A6B', icon: Layers, connections: ['center'] },
];

// --- Ecosystem Tree Desktop Nodes ---
export const ECOSYSTEM_TREE_DESKTOP_NODES = [
  // Center
  { id: 'center', label: 'GXY LABS', name: 'GXY LABS', type: 'center', x: 300, y: 35, radius: 14, color: '#1B3A6B', connections: ['v0', 'v1', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'] },
  // Verticals
  { id: 'v3', label: 'AI & ML', name: 'AI & ML', type: 'vertical', x: 80, y: 130, radius: 13, color: '#1B3A6B', icon: Cpu, connections: ['center', 'p_graphzy', 'p_clampbox'] },
  { id: 'v5', label: 'Custom Software', name: 'Custom Software', type: 'vertical', x: 150, y: 130, radius: 13, color: '#1B3A6B', icon: Code, connections: ['center', 'p_graphzy'] },
  { id: 'v1', label: 'Web Development', name: 'Web Development', type: 'vertical', x: 220, y: 130, radius: 13, color: '#1B3A6B', icon: Monitor, connections: ['center', 'p_graphzy', 'p_forkline', 'p_lattice'] },
  { id: 'v0', label: 'Management Systems', name: 'Management Systems', type: 'vertical', x: 290, y: 130, radius: 13, color: '#1B3A6B', icon: Grid, connections: ['center', 'p_forkline'] },
  { id: 'v6', label: 'Automation', name: 'Automation', type: 'vertical', x: 360, y: 130, radius: 13, color: '#1B3A6B', icon: GitMerge, connections: ['center', 'p_forkline', 'p_clampbox'] },
  { id: 'v4', label: 'Data Engineering', name: 'Data Engineering', type: 'vertical', x: 430, y: 130, radius: 13, color: '#1B3A6B', icon: Database, connections: ['center', 'p_lattice'] },
  { id: 'v7', label: 'Cloud Solutions', name: 'Cloud Solutions', type: 'vertical', x: 500, y: 130, radius: 13, color: '#1B3A6B', icon: Layers, connections: ['center', 'p_lattice', 'p_clampbox'] },
  { id: 'v8', label: 'Systems Security', name: 'Systems Security', type: 'vertical', x: 570, y: 130, radius: 13, color: '#1B3A6B', icon: Shield, connections: ['center', 'p_clampbox'] },
  // Products (Now converted to core capabilities)
  { id: 'p_graphzy', label: 'Web Platforms', name: 'Web Platforms', type: 'product', x: 90, y: 240, radius: 0, color: '#0066CC', link: '/services', tag: 'CORE DIVISION', connects: ['v1', 'v3', 'v5'], connections: ['v1', 'v3', 'v5'] },
  { id: 'p_clampbox', label: 'Secure Infrastructure', name: 'Secure Infrastructure', type: 'product', x: 240, y: 240, radius: 0, color: '#0D9488', link: '/services', tag: 'CORE DIVISION', connects: ['v3', 'v6', 'v7', 'v8'], connections: ['v3', 'v6', 'v7', 'v8'] },
  { id: 'p_forkline', label: 'Business Automation', name: 'Business Automation', type: 'product', x: 390, y: 240, radius: 0, color: '#92400E', link: '/services', tag: 'CORE DIVISION', connects: ['v0', 'v1', 'v6'], connections: ['v0', 'v1', 'v6'] },
  { id: 'p_lattice', label: 'Data & Analytics', name: 'Data & Analytics', type: 'product', x: 510, y: 240, radius: 0, color: '#1B3A6B', link: '/services', tag: 'CORE DIVISION', connects: ['v1', 'v4', 'v7'], connections: ['v1', 'v4', 'v7'] },
];

// --- Ecosystem Tree Mobile Nodes ---
export const ECOSYSTEM_TREE_MOBILE_NODES = [
  // Center
  { id: 'center', label: 'GXY LABS', name: 'GXY LABS', type: 'center', x: 180, y: 30, radius: 16, color: '#1B3A6B', connections: ['v0', 'v1', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'] },
  // Verticals
  { id: 'v3', label: 'AI & ML', name: 'AI & ML', type: 'vertical', x: 48, y: 100, radius: 16, color: '#1B3A6B', icon: Cpu, connections: ['center', 'p_graphzy', 'p_clampbox'] },
  { id: 'v5', label: 'Custom Software', name: 'Custom Software', type: 'vertical', x: 136, y: 100, radius: 16, color: '#1B3A6B', icon: Code, connections: ['center', 'p_graphzy'] },
  { id: 'v1', label: 'Web Dev', name: 'Web Dev', type: 'vertical', x: 224, y: 100, radius: 16, color: '#1B3A6B', icon: Monitor, connections: ['center', 'p_graphzy', 'p_forkline', 'p_lattice'] },
  { id: 'v0', label: 'Mgmt Systems', name: 'Mgmt Systems', type: 'vertical', x: 312, y: 100, radius: 16, color: '#1B3A6B', icon: Grid, connections: ['center', 'p_forkline'] },
  { id: 'v6', label: 'Automation', name: 'Automation', type: 'vertical', x: 45, y: 175, radius: 16, color: '#1B3A6B', icon: GitMerge, connections: ['center', 'p_forkline', 'p_clampbox'] },
  { id: 'v4', label: 'Data Engineering', name: 'Data Engineering', type: 'vertical', x: 135, y: 175, radius: 16, color: '#1B3A6B', icon: Database, connections: ['center', 'p_lattice'] },
  { id: 'v7', label: 'Cloud Solutions', name: 'Cloud Solutions', type: 'vertical', x: 225, y: 175, radius: 16, color: '#1B3A6B', icon: Layers, connections: ['center', 'p_lattice', 'p_clampbox'] },
  { id: 'v8', label: 'Systems Security', name: 'Systems Security', type: 'vertical', x: 315, y: 175, radius: 16, color: '#1B3A6B', icon: Shield, connections: ['center', 'p_clampbox'] },
  // Products (Now converted to core capabilities)
  { id: 'p_graphzy', label: 'Web Platforms', name: 'Web Platforms', type: 'product', x: 50, y: 260, radius: 0, color: '#0066CC', link: '/services', tag: 'CORE DIVISION', description: 'High-performance web applications and responsive interfaces.', connections: ['v1', 'v3', 'v5'] },
  { id: 'p_clampbox', label: 'Secure Infrastructure', name: 'Secure Infrastructure', type: 'product', x: 130, y: 260, radius: 0, color: '#0D9488', link: '/services', tag: 'CORE DIVISION', description: 'Confidential cloud execution, robust encryption, and security.', connections: ['v3', 'v6', 'v7', 'v8'] },
  { id: 'p_forkline', label: 'Business Automation', name: 'Business Automation', type: 'product', x: 220, y: 260, radius: 0, color: '#92400E', link: '/services', tag: 'CORE DIVISION', description: 'Custom operational pipelines, integrations, and ERP system flow.', connections: ['v0', 'v1', 'v6'] },
  { id: 'p_lattice', label: 'Data & Analytics', name: 'Data & Analytics', type: 'product', x: 310, y: 260, radius: 0, color: '#1B3A6B', link: '/services', tag: 'CORE DIVISION', description: 'Telemetry panels, data ingestion pipelines, and metrics views.', connections: ['v1', 'v4', 'v7'] },
];

// ==============================================================================
// 3. RADIAL CONFIG BUILDER (Dynamic positions matching standard schema)
// ==============================================================================

export const RADIAL_VERTICALS = [
  { id: 'v0', name: 'Management Systems', short: 'Mgmt', icon: Grid },
  { id: 'v1', name: 'Web Development', short: 'Web Dev', icon: Monitor },
  { id: 'v2', name: 'Mobile Applications', short: 'Mobile', icon: Smartphone },
  { id: 'v3', name: 'AI & Machine Learning', short: 'AI / ML', icon: Cpu },
  { id: 'v4', name: 'Data Engineering', short: 'Data Eng', icon: Database },
  { id: 'v5', name: 'Custom Software', short: 'Custom SW', icon: Code },
  { id: 'v6', name: 'Automation', short: 'Auto', icon: GitMerge },
  { id: 'v7', name: 'Cloud Solutions', short: 'Cloud', icon: Layers },
];

export const RADIAL_PRODUCTS = [];

const PRODUCT_ANGLES_RAD = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

function polarToCart(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: Math.round(cx + r * Math.cos(a)), y: Math.round(cy + r * Math.sin(a)) };
}

export function buildRadialPositions({ cx, cy, innerR, outerR }) {
  const verts = RADIAL_VERTICALS.map((v, i) => {
    const angleDeg = (i / 8) * 360 - 90;
    const { x, y } = polarToCart(cx, cy, innerR, angleDeg);
    return {
      ...v,
      rx: x,
      ry: y,
      x,
      y,
      type: 'vertical',
      radius: 17,
      color: '#1B3A6B',
      connections: RADIAL_PRODUCTS.filter(p => p.connects.includes(v.id)).map(p => p.id),
      angleDeg
    };
  });

  const prods = RADIAL_PRODUCTS.map((p, i) => {
    const angleDeg = (PRODUCT_ANGLES_RAD[i] * 180) / Math.PI;
    const { x, y } = polarToCart(cx, cy, outerR, angleDeg);
    return {
      ...p,
      rx: x,
      ry: y,
      x,
      y,
      type: 'product',
      radius: 0,
      connections: p.connects,
      color: p.color
    };
  });

  return { verts, prods };
}

// ==============================================================================
// 4. VALIDATION LAYER (P1 requirements - prevent undefined coordinate rendering)
// ==============================================================================

export function validateNode(node) {
  if (!node) return false;
  const hasId = typeof node.id === 'string' && node.id.length > 0;
  const hasLabel = typeof node.label === 'string' || typeof node.name === 'string';
  const hasType = ['center', 'vertical', 'product'].includes(node.type);
  const hasX = typeof node.x === 'number' && !isNaN(node.x);
  const hasY = typeof node.y === 'number' && !isNaN(node.y);
  const hasRadius = typeof node.radius === 'number' && !isNaN(node.radius);
  const hasColor = typeof node.color === 'string';
  const hasConnections = Array.isArray(node.connections) || Array.isArray(node.connects);
  return !!(hasId && hasLabel && hasType && hasX && hasY && hasRadius && hasColor && hasConnections);
}

export function validateConnection(source, target) {
  if (!source || !target) return false;
  const hasSourceCoords = typeof source.x === 'number' && !isNaN(source.x) && typeof source.y === 'number' && !isNaN(source.y);
  const hasTargetCoords = typeof target.x === 'number' && !isNaN(target.x) && typeof target.y === 'number' && !isNaN(target.y);
  return hasSourceCoords && hasTargetCoords;
}

export function runEcosystemValidation() {
  const datasets = {
    heroScatter: HERO_SCATTER_NODES,
    ecosystemTreeDesktop: ECOSYSTEM_TREE_DESKTOP_NODES,
    ecosystemTreeMobile: ECOSYSTEM_TREE_MOBILE_NODES,
  };

  Object.entries(datasets).forEach(([name, nodes]) => {
    const ids = new Set();
    nodes.forEach(node => {
      // Schema validation
      if (!validateNode(node)) {
        console.warn(`[Ecosystem Validation - ${name}] Node fails schema validation:`, node);
      }
      
      // Duplicate IDs
      if (ids.has(node.id)) {
        console.warn(`[Ecosystem Validation - ${name}] Duplicate node ID found: ${node.id}`);
      }
      ids.add(node.id);

      // Orphan validation
      const connections = node.connections || node.connects || [];
      if (connections.length === 0 && node.id !== 'v2') {
        console.warn(`[Ecosystem Validation - ${name}] Orphan node found: ${node.id}`);
      }

      // Broken connections
      connections.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) {
          console.warn(`[Ecosystem Validation - ${name}] Broken connection: Node ${node.id} references non-existent node ${targetId}`);
        }
      });
    });
  });

  // Sample check dynamic build radial
  const radialSample = buildRadialPositions({ cx: 200, cy: 170, innerR: 74, outerR: 130 });
  const radialNodes = [...radialSample.verts, ...radialSample.prods];
  radialNodes.forEach(node => {
    if (!validateNode(node)) {
      console.warn(`[Ecosystem Validation - radialSample] Dynamic node fails schema validation:`, node);
    }
  });
}

// Development-only self-executing validation check
if (import.meta.env.DEV) {
  runEcosystemValidation();
}

export const VERTICALS = RADIAL_VERTICALS;
export const PRODUCTS = RADIAL_PRODUCTS;
