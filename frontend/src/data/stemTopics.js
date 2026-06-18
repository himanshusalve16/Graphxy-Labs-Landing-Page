// Comprehensive STEM Topics Database for Graphzy
// Mapped to exactly 8 high-quality working topics per subject
// Subjects: Mathematics, Physics, Chemistry, Biology

export const stemTopics = {
  // ==========================================
  // MATHEMATICS
  // ==========================================
  math: [
    {
      topicKey: "algebra",
      displayName: "Quadratic Roots & Formula",
      equation: "y = a*x^2 + b*x + c",
      keyIdea: "Vertex Shifts & Parabolic Roots",
      summary: "In quadratic algebra, the equation $y = ax^2 + bx + c$ maps to a parabola. Adjusting the leading coefficient $a$ changes the vertical stretch, while $b$ and $c$ translate the vertex. The roots occur where $y = 0$, calculated using the quadratic formula.",
      concepts: ["quadratics", "parabolic vertex", "real roots", "algebraic graphs", "parabola"],
      sliders: [
        { id: "a", label: "Stretch Factor (a)", min: -3, max: 3, step: 0.1, val: 1.0 },
        { id: "b", label: "Linear Shift (b)", min: -4, max: 4, step: 0.1, val: 0.0 },
        { id: "c", label: "Constant Term (c)", min: -5, max: 5, step: 0.1, val: -1.0 }
      ],
      followUps: ["What makes the roots complex?", "How do b and c shift the vertex?", "Find coordinates of the vertex"],
      visualStyle: "function_plot",
      metadata: {
        type: "Polynomial Curve",
        domain: "x ∈ ℝ",
        range: "y ≥ c - b²/4a (for a > 0)",
        symmetry: "Axis x = -b/2a"
      },
      aiLogs: {
        tokens: { prompt: 1420, completion: 480 },
        latency_ms: 120,
        model: "Math-Inference-v4.1"
      }
    },
    {
      topicKey: "geometry",
      displayName: "Polygon Interior Angles",
      equation: "\\theta = (n - 2) * 180^\\circ / n",
      keyIdea: "Regular Polygon Angle Sums",
      summary: "A regular polygon with $n$ sides has an interior angle sum of $(n - 2) \\times 180^\\circ$. As the number of sides $n$ increases, the polygon approaches a circle, and each interior angle $\\theta$ approaches $180^\\circ$.",
      concepts: ["polygons", "interior angles", "geometric symmetry", "limits"],
      sliders: [
        { id: "sides", label: "Number of Sides (n)", min: 3, max: 12, step: 1, val: 5 }
      ],
      followUps: ["What is the interior angle of a triangle?", "Why does it approach a circle?", "What is the exterior angle sum?"],
      visualStyle: "geometry_polygon",
      metadata: {
        type: "Discrete Geometry",
        sumFormula: "(n - 2) * 180°",
        symmetryGroup: "D_n",
        limitCircle: "As n → ∞"
      },
      aiLogs: {
        tokens: { prompt: 1210, completion: 310 },
        latency_ms: 95,
        model: "Geometry-Engine-v4"
      }
    },
    {
      topicKey: "trigonometry",
      displayName: "Trigonometric Sine Waves",
      equation: "y = a * \\sin(b * x) + c",
      keyIdea: "Sine Amplitude and Wave Periodicity",
      summary: "The sine wave $y = a \\sin(bx) + c$ is the fundamental wave in trigonometry. The parameter $a$ controls amplitude (vertical stretch), $b$ controls frequency (compressing wavelength to $2\\pi / b$), and $c$ shifts it vertically.",
      concepts: ["trig functions", "amplitude", "frequency", "wave phase", "sine wave", "sine"],
      sliders: [
        { id: "a", label: "Amplitude (a)", min: -4, max: 4, step: 0.1, val: 1.5 },
        { id: "b", label: "Frequency (b)", min: 0.5, max: 4, step: 0.1, val: 2.0 },
        { id: "c", label: "Vertical Shift (c)", min: -3, max: 3, step: 0.1, val: 0.0 }
      ],
      followUps: ["What is the wavelength?", "What if a is negative?", "Show cosine wave instead"],
      visualStyle: "function_plot",
      metadata: {
        type: "Periodic Transcendental",
        period: "2π / b",
        domain: "x ∈ (-∞, +∞)",
        range: "y ∈ [c - |a|, c + |a|]"
      },
      aiLogs: {
        tokens: { prompt: 1300, completion: 410 },
        latency_ms: 110,
        model: "Math-Inference-v4.1"
      }
    },
    {
      topicKey: "calculus",
      displayName: "Calculus Derivatives & Tangents",
      equation: "f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0+h) - f(x_0)}{h}",
      keyIdea: "Instantaneous Rates & Slope of Tangents",
      summary: "In calculus, the derivative $f'(x_0)$ represents the instantaneous rate of change of $f(x)$ at $x_0$. Visually, it is the slope of the tangent line touching the curve at $(x_0, f(x_0))$.",
      concepts: ["derivatives", "rates of change", "tangent lines", "limits", "calculus"],
      sliders: [
        { id: "x0", label: "Tangent Point (x₀)", min: -3, max: 3, step: 0.1, val: 1.0 }
      ],
      followUps: ["What is the derivative of x²?", "What happens at local extrema?", "Show secant approaching tangent"],
      visualStyle: "calculus_tangent",
      metadata: {
        function: "f(x) = 0.5 * x^2",
        tangentSlope: "f'(x₀) = x₀",
        tangentEq: "y = x₀*x - 0.5*x₀²",
        type: "Differential Calculus"
      },
      aiLogs: {
        tokens: { prompt: 1540, completion: 520 },
        latency_ms: 130,
        model: "Calculus-Inference-v4"
      }
    },
    {
      topicKey: "coordinate geometry",
      displayName: "Coordinate Distance Formula",
      equation: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
      keyIdea: "2D Cartesian Coordinate Spacing",
      summary: "Using the Pythagorean theorem, the distance formula computes the straight-line segment length between $P_1(x_1, y_1)$ and $P_2(x_2, y_2)$. Adjusting the coordinates shifts the endpoints and changes the distance.",
      concepts: ["coordinates", "cartesian distance", "pythagorean theorem", "vectors", "distance"],
      sliders: [
        { id: "x2", label: "Point 2 X-coord", min: -5, max: 5, step: 0.2, val: 3.0 },
        { id: "y2", label: "Point 2 Y-coord", min: -5, max: 5, step: 0.2, val: 4.0 }
      ],
      followUps: ["What if coordinates match?", "Calculate distance from origin", "How does this relate to vectors?"],
      visualStyle: "coordinate_distance",
      metadata: {
        fixedPoint: "P₁(0, 0)",
        movingPoint: "P₂(x₂, y₂)",
        type: "2D Analytical Geometry"
      },
      aiLogs: {
        tokens: { prompt: 1100, completion: 290 },
        latency_ms: 85,
        model: "Geometry-Engine-v4"
      }
    },
    {
      topicKey: "sequences and series",
      displayName: "Geometric Series Summation",
      equation: "S_n = a * (1 - r^n) / (1 - r)",
      keyIdea: "Summation Convergences & Divergences",
      summary: "A geometric series sums terms with a constant ratio $r$: $a + ar + ar^2 + \\dots$. When $|r| < 1$, the series converges to a finite sum $S_\\infty = a / (1 - r)$ as the number of terms $n \\to \\infty$.",
      concepts: ["sequences", "geometric series", "series convergence", "limits", "summation"],
      sliders: [
        { id: "r", label: "Common Ratio (r)", min: 0.1, max: 1.5, step: 0.05, val: 0.6 },
        { id: "n", label: "Terms Count (n)", min: 1, max: 10, step: 1, val: 5 }
      ],
      followUps: ["What if common ratio r >= 1?", "Calculate sum of infinite terms", "What is the 5th term value?"],
      visualStyle: "series_convergence",
      metadata: {
        type: "Infinite Series",
        baseTerm: "a = 2.0",
        ratioVal: "r",
        status: "r < 1 ? 'Converges' : 'Diverges'"
      },
      aiLogs: {
        tokens: { prompt: 1180, completion: 340 },
        latency_ms: 90,
        model: "Math-Inference-v4.1"
      }
    },
    {
      topicKey: "matrices",
      displayName: "2D Matrix Grid Transformations",
      equation: "\\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}",
      keyIdea: "Linear Shear & Rotation Transformations",
      summary: "Linear matrix transforms map coordinates to new grids. The coefficients $a$, $b$, $c$, $d$ scale, shear, or rotate a square box. Adjusting the values distorts the unit grid dynamically.",
      concepts: ["matrices", "linear transformations", "shearing", "eigenvectors", "matrix"],
      sliders: [
        { id: "a", label: "M_11 (Scale X)", min: -2, max: 2, step: 0.1, val: 1.0 },
        { id: "b", label: "M_12 (Shear X)", min: -2, max: 2, step: 0.1, val: 0.5 }
      ],
      followUps: ["What does the determinant calculate?", "How is rotation achieved?", "Find the matrix eigenvalues"],
      visualStyle: "matrix_grid",
      metadata: {
        matrix: "[[a, b], [0, 1.0]]",
        determinant: "a * 1.0 - b * 0 = a",
        type: "Linear Algebra"
      },
      aiLogs: {
        tokens: { prompt: 1390, completion: 430 },
        latency_ms: 118,
        model: "Math-Inference-v4.1"
      }
    },
    {
      topicKey: "integrals",
      displayName: "Integral Riemann Sums",
      equation: "A = \\int_{a}^{b} f(x) dx \\approx \\sum_{i=1}^{n} f(x_i) \\Delta x",
      keyIdea: "Shaded Area Under Polynomial Curves",
      summary: "Integration computes the area under a curve. Riemann sums approximate this area using rectangles. As the rectangle count $n$ increases, the width $\\Delta x$ shrinks, and the sum converges to the exact integral.",
      concepts: ["integrals", "riemann sums", "area approximation", "calculus", "integration"],
      sliders: [
        { id: "rects", label: "Rectangles Count (n)", min: 4, max: 40, step: 1, val: 10 }
      ],
      followUps: ["What is the Fundamental Theorem?", "Explain lower vs upper sums", "Integrate x² from -2 to 2"],
      visualStyle: "calculus_integral",
      metadata: {
        function: "y = 0.2*x^2 + 1",
        interval: "x ∈ [-3, 3]",
        rectCount: "n",
        approxArea: "Calculated live"
      },
      aiLogs: {
        tokens: { prompt: 1590, completion: 530 },
        latency_ms: 135,
        model: "Calculus-Inference-v4"
      }
    }
  ],

  // ==========================================
  // PHYSICS
  // ==========================================
  physics: [
    {
      topicKey: "motion",
      displayName: "Linear Kinematics Motion",
      equation: "s = v * t",
      keyIdea: "Distance Over Time plots",
      summary: "Constant velocity motion plots as a straight line. Adjusting velocity rotates the slope, while adjustments in elapsed time animate the runner's coordinate dot along the path.",
      concepts: ["kinematics", "constant velocity", "slope analysis", "mechanics", "motion"],
      sliders: [
        { id: "velocity", label: "Constant Velocity (v)", min: 2, max: 15, step: 0.5, val: 8.0 },
        { id: "time", label: "Elapsed Time (t)", min: 0.2, max: 10, step: 0.1, val: 5.0 }
      ],
      followUps: ["What if acceleration is added?", "Explain the slope of distance vs time", "How is average velocity calculated?"],
      visualStyle: "physics_motion",
      metadata: {
        displacement: "v * t",
        acceleration: "a = 0",
        type: "Classical Mechanics"
      },
      aiLogs: {
        tokens: { prompt: 1120, completion: 280 },
        latency_ms: 88,
        model: "Physics-Engine-v4"
      }
    },
    {
      topicKey: "kinematics",
      displayName: "Projectile Trajectory Motion",
      equation: "y = x * \\tan(\\theta) - \\frac{g * x^2}{2 * v^2 * \\cos^2(\\theta)}",
      keyIdea: "Parabolic Trajectory Launch Kinematics",
      summary: "In uniform gravity, projectiles trace parabolic paths. Launch angle and initial velocity determine peak altitude, horizontal range, and total flight duration.",
      concepts: ["projectile kinematics", "parabolic trajectory", "vector components", "gravity", "projectile"],
      sliders: [
        { id: "angle", label: "Launch Angle (θ)", min: 10, max: 85, step: 1, val: 45.0 },
        { id: "velocity", label: "Initial Velocity (v)", min: 5, max: 40, step: 0.5, val: 20.0 }
      ],
      followUps: ["Find maximum launch range", "What if gravity shifts to 1.6m/s²?", "How is vertical speed modeled?"],
      visualStyle: "physics_projectile",
      metadata: {
        gConstant: "9.8 m/s²",
        maxAltitude: "Calculated live",
        flightRange: "Calculated live"
      },
      aiLogs: {
        tokens: { prompt: 1410, completion: 460 },
        latency_ms: 120,
        model: "Physics-Engine-v4"
      }
    },
    {
      topicKey: "forces",
      displayName: "Inclined Plane Free Body",
      equation: "F_{net} = m * g * \\sin(\\theta) - F_{friction}",
      keyIdea: "Gravity Components & Normal Force",
      summary: "On an inclined plane, gravity splits into parallel ($mg\\sin\\theta$) and perpendicular ($mg\\cos\\theta$) components. Mass and angle adjustments alter friction, normal force, and net acceleration.",
      concepts: ["forces", "newtons laws", "gravity vectors", "friction coeff", "inclined plane"],
      sliders: [
        { id: "mass", label: "Object Mass (m)", min: 2, max: 20, step: 1, val: 10 },
        { id: "incline", label: "Incline Angle (θ)", min: 5, max: 60, step: 1, val: 30 }
      ],
      followUps: ["Calculate normal force", "What shifts acceleration to 0?", "Explain static vs kinetic friction"],
      visualStyle: "physics_forces",
      metadata: {
        normalForce: "m * g * cos(θ)",
        gravityForce: "m * g",
        frictionCoeff: "μ = 0.2"
      },
      aiLogs: {
        tokens: { prompt: 1380, completion: 410 },
        latency_ms: 110,
        model: "Physics-Engine-v4"
      }

    },
    {
      topicKey: "waves",
      displayName: "Wave Interference Superposition",
      equation: "y = a_1*\\sin(k*x) + a_2*\\sin(k*x - \\phi)",
      keyIdea: "Constructive vs Destructive Interference",
      summary: "Superposition occurs when two waves overlap, summing their amplitudes. Tuning the phase difference from $0$ (constructive) to $\\pi$ (destructive) adjusts the combined wave amplitude.",
      concepts: ["waves", "superposition", "wave interference", "phase shift", "interference"],
      sliders: [
        { id: "amp", label: "Wave Amplitude (a)", min: 0.5, max: 3, step: 0.1, val: 1.5 },
        { id: "phase", label: "Phase Shift (φ)", min: 0, max: 3.14, step: 0.1, val: 0.0 }
      ],
      followUps: ["Show complete destructive interference", "What are nodes and antinodes?", "How do standing waves form?"],
      visualStyle: "physics_waves",
      metadata: {
        phaseDegrees: "phase * 180 / π",
        waveType: "Sinusoidal Harmonics",
        combinedAmp: "a * cos(φ/2)"
      },
      aiLogs: {
        tokens: { prompt: 1390, completion: 440 },
        latency_ms: 114,
        model: "Physics-Engine-v4"
      }
    },
    {
      topicKey: "oscillations",
      displayName: "Spring Simple Harmonic Motion",
      equation: "x(t) = A * \\cos(\\omega * t)",
      keyIdea: "Spring Stiffness Constant & Periodic Motion",
      summary: "Mass-spring systems execute simple harmonic motion. The period $T = 2\\pi \\sqrt{m / k}$ depends on mass and spring stiffness. Stiffer spring constant $k$ speeds up the frequency.",
      concepts: ["oscillations", "simple harmonic motion", "spring constant", "period", "spring"],
      sliders: [
        { id: "mass", label: "Object Mass (m)", min: 1, max: 10, step: 0.5, val: 4.0 },
        { id: "k", label: "Spring Constant (k)", min: 5, max: 50, step: 1, val: 20 }
      ],
      followUps: ["Calculate oscillation frequency", "Show conservation of spring energy", "What is restoring force formula?"],
      visualStyle: "physics_oscillations",
      metadata: {
        frequencyHz: "sqrt(k / m) / 2π",
        periodSeconds: "2π * sqrt(m / k)",
        type: "Mechanical Oscillations"
      },
      aiLogs: {
        tokens: { prompt: 1450, completion: 490 },
        latency_ms: 125,
        model: "Physics-Engine-v4"
      }
    },
    {
      topicKey: "electricity",
      displayName: "Ohm's Law Circuits",
      equation: "I = V / R",
      keyIdea: "Current flow vs Resistor load",
      summary: "Ohm's Law governs electrical circuits: Current ($I$) is proportional to voltage ($V$) and inversely proportional to resistance ($R$). Adjusting resistance reduces current flow.",
      concepts: ["circuits", "electrical current", "resistors", "volts", "ohms law"],
      sliders: [
        { id: "voltage", label: "Voltage (V)", min: 2, max: 24, step: 0.5, val: 12.0 },
        { id: "resistance", label: "Resistance (R)", min: 5, max: 100, step: 5, val: 20 }
      ],
      followUps: ["Show schematic electron flow rate", "Calculate power dissipated (P=VI)", "What is conductivity?"],
      visualStyle: "physics_circuit",
      metadata: {
        currentAmps: "V / R",
        powerWatts: "V² / R",
        loadStatus: "R < 10 ? 'High Load' : 'Normal'"
      },
      aiLogs: {
        tokens: { prompt: 1200, completion: 320 },
        latency_ms: 92,
        model: "Physics-Engine-v4"
      }
    }
  ],

  // ==========================================
  // CHEMISTRY
  // ==========================================
  chemistry: [
    {
      topicKey: "atomic structure",
      displayName: "Bohr Hydrogen Model",
      equation: "r_n = n^2 * a_0",
      keyIdea: "Quantized electron orbits & Shells",
      summary: "In the Bohr model, electrons orbit the nucleus in discrete energy levels. Adjusting the quantum shell number $n$ increases the orbit radius, while transitions simulate spectral emissions.",
      concepts: ["bohr model", "hydrogen spectra", "quantum energy", "shells", "bohr"],
      sliders: [
        { id: "shell", label: "Active Shell (n)", min: 1, max: 4, step: 1, val: 2 }
      ],
      followUps: ["Calculate energy level transition (Rydberg)", "Why did quantum mechanics replace Bohr?", "State orbital radius of ground state"],
      visualStyle: "chem_bohr",
      metadata: {
        radiusShell: "n² * 52.9 pm",
        energyLevel: "-13.6 / n² eV",
        type: "Atomic Chemistry"
      },
      aiLogs: {
        tokens: { prompt: 1210, completion: 330 },
        latency_ms: 95,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "bonding",
      displayName: "Covalent Bond Sharing",
      equation: "Potential Well V(r)",
      keyIdea: "Orbital Overlap & Intermolecular Spacing",
      summary: "Covalent bonds form when overlapping atomic orbitals share electrons. Adjusting inter-nuclear distance maps the potential energy curve, identifying the stable bond length.",
      concepts: ["bonding", "potential energy curve", "covalent sharing", "orbitals", "covalent bond"],
      sliders: [
        { id: "dist", label: "Nuclear Distance (pm)", min: 40, max: 200, step: 5, val: 74 }
      ],
      followUps: ["What defines bond energy?", "Compare single vs double bonds", "How do ionic bonds form?"],
      visualStyle: "chem_bonding",
      metadata: {
        stableLength: "74 pm",
        depthPotential: "V_min = -436 kJ/mol",
        covalentRadii: "H = 37 pm"
      },
      aiLogs: {
        tokens: { prompt: 1310, completion: 410 },
        latency_ms: 104,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "states of matter",
      displayName: "States of Matter Particles",
      equation: "Phase Map (Solid, Liquid, Gas)",
      keyIdea: "Kinetic Molecular Energy & Phase States",
      summary: "The Kinetic Molecular Theory details particle phases. Adjusting temperature changes particle kinetic energy, shifting states from solid (rigid) to gas (highly chaotic).",
      concepts: ["kinetic theory", "solid liquid gas", "phase change", "temperature", "states of matter"],
      sliders: [
        { id: "temp", label: "Temperature (K)", min: 50, max: 500, step: 10, val: 100 }
      ],
      followUps: ["What happens at critical point?", "Define latent heat of fusion", "How does pressure affect phase changes?"],
      visualStyle: "chem_states",
      metadata: {
        phaseState: "temp < 150 ? 'Solid' : temp < 350 ? 'Liquid' : 'Gas'",
        meanSpeed: "sqrt(T) factor",
        type: "Physical Chemistry"
      },
      aiLogs: {
        tokens: { prompt: 1390, completion: 450 },
        latency_ms: 112,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "thermodynamics",
      displayName: "Thermodynamic Activation Energies",
      equation: "E_{act} = Barrier Energy",
      keyIdea: "Enthalpy reaction coordinate paths",
      summary: "Chemical thermodynamics tracks energy shifts. Exothermic reactions release heat (negative $\\Delta H$), while activation energy barriers determine reaction velocities.",
      concepts: ["enthalpy", "activation barrier", "exothermic", "endothermic", "thermodynamics"],
      sliders: [
        { id: "deltaH", label: "Enthalpy (ΔH) kJ/mol", min: -80, max: 80, step: 2, val: -40 },
        { id: "ea", label: "Activation Energy (Ea)", min: 20, max: 120, step: 2, val: 60 }
      ],
      followUps: ["How do catalysts lower Ea?", "Show endothermic energy profile", "Define Gibbs Free Energy"],
      visualStyle: "chem_thermo",
      metadata: {
        reactionType: "deltaH < 0 ? 'Exothermic' : 'Endothermic'",
        transitionState: "Ea",
        netEnthalpy: "deltaH"
      },
      aiLogs: {
        tokens: { prompt: 1410, completion: 480 },
        latency_ms: 120,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "equilibrium",
      displayName: "Equilibrium Concentrations",
      equation: "K_c = \\frac{[C]^c}{[A]^a [B]^b}",
      keyIdea: "Le Chatelier Concentration Shifts",
      summary: "At equilibrium, reactant and product ratios remain constant ($K_c$). Adding reactants shifts the equilibrium forward to yield more products, maintaining the ratio.",
      concepts: ["chemical equilibrium", "equilibrium constant", "le chatelier", "reaction quotient", "equilibrium"],
      sliders: [
        { id: "kc", label: "Equilibrium Constant (Kc)", min: 0.1, max: 10, step: 0.1, val: 2.0 },
        { id: "addA", label: "Inject Reactant A", min: 1, max: 5, step: 0.2, val: 1.0 }
      ],
      followUps: ["How does temp shift Kc?", "Explain pressure effects on gas equilibrium", "Define reaction quotient Q"],
      visualStyle: "chem_equilibrium",
      metadata: {
        ratioProductsReactants: "Kc",
        shiftStatus: "addA > 1.0 ? 'Shift Right' : 'Equilibrium'",
        type: "Physical Chemistry"
      },
      aiLogs: {
        tokens: { prompt: 1300, completion: 390 },
        latency_ms: 102,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "acids and bases",
      displayName: "pH & Acid Dissociation",
      equation: "pH = -\\log_{10}[H^+]",
      keyIdea: "Hydrogen Ion logs & pH Scale",
      summary: "Acids dissociate in water, yielding hydrogen ions ($H^+$). The logarithmic pH scale maps acidity: values below 7 indicate acidic conditions, while values above 7 indicate basic conditions.",
      concepts: ["pH scale", "acid dissociation", "weak acids", "hydroxide", "pH"],
      sliders: [
        { id: "ph", label: "System pH", min: 1, max: 14, step: 0.2, val: 4.0 }
      ],
      followUps: ["Find hydrogen ion concentration", "Explain weak acid buffer solutions", "What is pKa and pKb?"],
      visualStyle: "chem_ph",
      metadata: {
        hConc: "10^-pH",
        ohConc: "10^-(14-pH)",
        acidStatus: "ph < 7 ? 'Acidic' : ph === 7 ? 'Neutral' : 'Basic'"
      },
      aiLogs: {
        tokens: { prompt: 1260, completion: 360 },
        latency_ms: 96,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "electrochemistry",
      displayName: "Galvanic Volts & Cells",
      equation: "E^0_{cell} = E^0_{cathode} - E^0_{anode}",
      keyIdea: "Redox electromotive cell potentials",
      summary: "Redox reactions drive current in galvanic cells. The cell potential ($E^0_{cell}$) is the difference between cathode reduction and anode oxidation potentials.",
      concepts: ["electrochemistry", "galvanic cell", "redox potentials", "anode cathode", "galvanic"],
      sliders: [
        { id: "cathodePot", label: "Cathode Pot (V)", min: -0.8, max: 1.5, step: 0.05, val: 0.34 },
        { id: "anodePot", label: "Anode Pot (V)", min: -1.5, max: 0.8, step: 0.05, val: -0.76 }
      ],
      followUps: ["Show schematic electron flow zinc-copper", "What does salt bridge balance?", "Calculate Gibbs Free Energy deltaG"],
      visualStyle: "chem_galvanic",
      metadata: {
        cellPotential: "cathodePot - anodePot",
        reactionDirection: "Spontaneous (E > 0)",
        type: "Electrochemistry"
      },
      aiLogs: {
        tokens: { prompt: 1350, completion: 420 },
        latency_ms: 110,
        model: "Chem-Simulation-v4"
      }
    },
    {
      topicKey: "molecular structure",
      displayName: "Water Molecule Bond Parameters",
      equation: "H_2O \\text{ Bond Geometry}",
      keyIdea: "Water Molecule Bond Angle and Polar Geometry",
      summary: "Water ($H_2O$) has bent geometry due to oxygen's $sp^3$ hybridization and lone pair repulsions. Adjusting parameters alters the net dipole moment vector.",
      concepts: ["molecular geometry", "covalent bonds", "dipole moment", "hybridization", "water molecule", "h2o", "water"],
      sliders: [
        { id: "bondAngle", label: "Bond Angle (θ)", min: 80, max: 180, step: 0.5, val: 104.5 },
        { id: "bondLength", label: "Bond Length (pm)", min: 50, max: 150, step: 1, val: 96.0 }
      ],
      followUps: ["Explain oxygen hybridization", "Why are lone pair repulsions strong?", "What is the net dipole value?"],
      visualStyle: "chem_water",
      metadata: {
        idealAngle: "104.5°",
        idealLength: "96.0 pm",
        hybridizationType: "sp³"
      },
      aiLogs: {
        tokens: { prompt: 1400, completion: 450 },
        latency_ms: 118,
        model: "Chem-Simulation-v4"
      }
    }
  ],

  // ==========================================
  // BIOLOGY
  // ==========================================
  biology: [
    {
      topicKey: "cells",
      displayName: "Organelle Focus & Cells",
      equation: "Cell Structure Map",
      keyIdea: "Plant cell wall vs Organelle highlights",
      summary: "Eukaryotic plant cells contain membrane-bound organelles with distinct functions. Adjusting the focus selector highlights organelles like the nucleus, mitochondria, or chloroplasts.",
      concepts: ["cell biology", "organelles", "chloroplasts", "eukaryote", "plant cell", "cell"],
      sliders: [
        { id: "organelle", label: "Select Organelle", min: 1, max: 4, step: 1, val: 1 }
      ],
      followUps: ["What is the function of chloroplast?", "Compare plant cells and animal cells", "What is the cell wall composition?"],
      visualStyle: "bio_cells",
      metadata: {
        highlightOrganelle: "organelle === 1 ? 'Nucleus' : organelle === 2 ? 'Mitochondria' : organelle === 3 ? 'Chloroplast' : 'Vacuole'",
        cellType: "Plant Eukaryote cell",
        membraneType: "Phospholipid Bilayer"
      },
      aiLogs: {
        tokens: { prompt: 1190, completion: 310 },
        latency_ms: 90,
        model: "Bio-Inference-v4"
      }
    },
    {
      topicKey: "biomolecules",
      displayName: "DNA Helix Structures",
      equation: "Helix pitch \\& Base Pairs",
      keyIdea: "DNA Double Helix spiral geometry",
      summary: "DNA contains nucleotide base pairs (A-T, C-G) organized in a double helix. Adjusting the twists slider expands or compresses the helical twists.",
      concepts: ["biomolecules", "double helix", "nucleotides", "base pairs", "dna", "helix"],
      sliders: [
        { id: "twists", label: "Helical Twists", min: 1, max: 4, step: 1, val: 2 }
      ],
      followUps: ["Describe hydrogen bonding in base pairs", "What are purines vs pyrimidines?", "How do transcription bubbles open?"],
      visualStyle: "bio_dna",
      metadata: {
        helixPitch: "3.4 nm per twist",
        basePairCount: "20",
        type: "Molecular Biology"
      },
      aiLogs: {
        tokens: { prompt: 1350, completion: 430 },
        latency_ms: 110,
        model: "Bio-Inference-v4"
      }

    },
    {
      topicKey: "plant biology",
      displayName: "Photosynthesis Flow Paths",
      equation: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2",
      keyIdea: "H₂O Photolysis and CO₂ Fixation",
      summary: "Photosynthesis splits into light reactions (converting light and water to ATP/NADPH) and the Calvin cycle (fixing carbon dioxide into glucose).",
      concepts: ["photosynthesis", "light reactions", "calvin cycle", "chloroplasts", "plant biology"],
      sliders: [
        { id: "light", label: "Light Intensity (W/m²)", min: 10, max: 100, step: 5, val: 50 }
      ],
      followUps: ["Explain water photolysis in Photosystem II", "What is the RuBisCO carbon fixation role?", "Show limiting rate curve"],
      visualStyle: "bio_photosynthesis",
      metadata: {
        rateO2Production: "light * 0.4",
        limitingFactor: "light < 30 ? 'Light Intensity' : 'Carbon Dioxide'",
        type: "Plant Physiology"
      },
      aiLogs: {
        tokens: { prompt: 1330, completion: 410 },
        latency_ms: 105,
        model: "Bio-Inference-v4"
      }
    },
    {
      topicKey: "ecology",
      displayName: "Trophic Energy Pyramids",
      equation: "E_n = E_0 * (0.1)^n",
      keyIdea: "10% Trophic Transfer Efficiency",
      summary: "Energy decreases by roughly 90% across trophic levels. The pyramid shows producer energy ($100\\%$) shrinking to primary ($10\\%$) and apex levels.",
      concepts: ["ecology", "trophic levels", "energy transfer", "ecosystem", "trophic"],
      sliders: [
        { id: "efficiency", label: "Transfer Efficiency Pct", min: 5, max: 20, step: 0.5, val: 10.0 }
      ],
      followUps: ["Why are food chains short?", "Define biomagnification of toxins", "What is primary productivity?"],
      visualStyle: "bio_trophic",
      metadata: {
        producerEnergy: "10000 Joules",
        primaryConsumer: "producerEnergy * efficiency / 100",
        apexConsumer: "producerEnergy * (efficiency / 100)^3"
      },
      aiLogs: {
        tokens: { prompt: 1240, completion: 360 },
        latency_ms: 98,
        model: "Bio-Inference-v4"
      }
    },
    {
      topicKey: "human physiology",
      displayName: "Cardiac Cycle Valve Beats",
      equation: "Heart Chamber Pressure",
      keyIdea: "Diastole & Systole valve transitions",
      summary: "The cardiac cycle alternates diastole (refilling) and systole (pumping). Adjusting heart rate changes chamber pressure profiles.",
      concepts: ["physiology", "cardiac cycle", "systole diastole", "pressure curves", "cardiac", "heart"],
      sliders: [
        { id: "bpm", label: "Heart Rate (BPM)", min: 50, max: 150, step: 5, val: 75 }
      ],
      followUps: ["Show volume vs pressure loop (PV loop)", "Explain stroke volume and cardiac output", "What triggers heart sounds?"],
      visualStyle: "bio_cardiac",
      metadata: {
        cardiacOutput: "70 mL * bpm",
        statusBeat: "bpm > 100 ? 'Tachycardia' : bpm < 60 ? 'Bradycardia' : 'Normal'",
        type: "Human Cardiovascular Physiology"
      },
      aiLogs: {
        tokens: { prompt: 1390, completion: 460 },
        latency_ms: 112,
        model: "Bio-Inference-v4"
      }
    },
    {
      topicKey: "nervous system",
      displayName: "Nerve Impulses & Synapses",
      equation: "Synaptic Cleft Vesicles",
      keyIdea: "Synaptic cleft vesicle release & firing",
      summary: "Nerve impulses trigger neurotransmitter vesicle release across synapses. Adjusting action potential frequency increases transmitter release rates.",
      concepts: ["synapse", "neurotransmitters", "action potentials", "receptors", "nervous system"],
      sliders: [
        { id: "freq", label: "Impulse Frequency (Hz)", min: 10, max: 100, step: 5, val: 40 }
      ],
      followUps: ["How do calcium ions trigger vesicle release?", "Explain depolarization in action potentials", "Show receptor saturation curve"],
      visualStyle: "bio_synapse",
      metadata: {
        vesicleReleaseRate: "freq * 0.15",
        statusCleft: "freq > 70 ? 'High Firing Rate' : 'Normal Firing'",
        type: "Neurobiology & Physiology"
      },
      aiLogs: {
        tokens: { prompt: 1430, completion: 470 },
        latency_ms: 116,
        model: "Bio-Inference-v4"
      }
    }
  ]
};
