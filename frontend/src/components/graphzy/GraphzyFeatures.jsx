import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export default function GraphzyFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-16 max-w-4xl mx-auto">
      <Card variant="surface" className="p-8">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Desmos Integration</h3>
        <p className="text-[12px] text-[#A3A3A3] leading-relaxed">
          Embeds the core graphing platform. Generates coordinate grids and maps variables to customizable controls.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 opacity-65">
        <div className="mb-2">
          <Badge>Coming Soon</Badge>
        </div>
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Chemistry Layer</h3>
        <p className="text-[12px] text-[#A3A3A3] leading-relaxed">
          3D visualizers loading molecular coordinates directly from PubChem structural PUG databases.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 opacity-65">
        <div className="mb-2">
          <Badge>Coming Soon</Badge>
        </div>
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Physics Simulations</h3>
        <p className="text-[12px] text-[#A3A3A3] leading-relaxed">
          Interactive sandboxes showing vector fields, gravitational pulls, and electric circuits.
        </p>
      </Card>
    </div>
  );
}
