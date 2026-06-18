// Follow-Up Answers Registry for Graphzy STEM topics
// Maps topicKey -> followUpQuestion -> answerText

export const followUpAnswers = {
  // ==========================================
  // MATHEMATICS
  // ==========================================
  "algebra": {
    "What makes the roots complex?": "Roots become complex when the discriminant $b^2 - 4ac < 0$. This occurs when the parabola is translated entirely above or below the x-axis (e.g., positive $a$ and $c$ with small $b$).",
    "How do b and c shift the vertex?": "The constant $c$ shifts the vertex vertically. The linear coefficient $b$ shifts the vertex along a parabolic path; the x-coordinate of the vertex is given by $h = -b/(2a)$.",
    "Find coordinates of the vertex": "The vertex coordinates are $(h, k)$ where $h = -b/(2a)$ and $k = c - b^2/(4a)$."
  },
  "geometry": {
    "What is the interior angle of a triangle?": "For a regular triangle ($n = 3$), the interior angle is $\\theta = (3-2) \\times 180^\\circ / 3 = 60^\\circ$.",
    "Why does it approach a circle?": "As the number of sides $n$ approaches infinity, the perimeter approaches a circle, and each interior angle $\\theta$ approaches $180^\\circ$.",
    "What is the exterior angle sum?": "The sum of the exterior angles of any convex polygon is always exactly $360^\\circ$, regardless of the number of sides $n$."
  },
  "trigonometry": {
    "What is the wavelength?": "The wavelength (period) of the wave is $\\lambda = 2\\pi / b$.",
    "What if a is negative?": "A negative amplitude $a$ reflects the wave across the x-axis, flipping the peaks into troughs and vice-versa.",
    "Show cosine wave instead": "A cosine wave is phase-shifted by $90^\\circ$ (or $\\pi/2$ radians): $\\cos(x) = \\sin(x + \\pi/2)$."
  },
  "calculus": {
    "What is the derivative of x²?": "Using the power rule, the derivative of $x^2$ is $\\frac{d}{dx}(x^2) = 2x$.",
    "What happens at local extrema?": "At local maximums or minimums, the slope of the tangent line is zero, meaning the derivative $f'(x) = 0$.",
    "Show secant approaching tangent": "A secant line crosses two points on a curve. As the distance $h$ between these points approaches $0$, the secant line converges to the tangent line at that point."
  },
  "coordinate geometry": {
    "What if coordinates match?": "If the coordinates of both points are identical, the term $(x_2-x_1)^2 + (y_2-y_1)^2 = 0$, so the distance $d = 0$.",
    "Calculate distance from origin": "The distance from the origin $(0,0)$ to point $(x,y)$ simplifies to $d = \\sqrt{x^2 + y^2}$.",
    "How does this relate to vectors?": "The distance formula represents the magnitude (length) of the vector connecting $P_1$ and $P_2$: $\\|\\vec{u}\\| = \\sqrt{u_x^2 + u_y^2}$."
  },
  "sequences and series": {
    "What if common ratio r >= 1?": "If the common ratio $|r| \\ge 1$, each term grows or stays constant, causing the sum $S_n$ to diverge to infinity as $n \\to \\infty$.",
    "Calculate sum of infinite terms": "For $|r| < 1$, the sum of an infinite geometric series converges to $S_\\infty = \\frac{a}{1 - r}$.",
    "What is the 5th term value?": "The $n$-th term of a geometric sequence is given by $a_n = a \\cdot r^{n-1}$. For $n=5$, $a_5 = a \\cdot r^4$."
  },
  "matrices": {
    "What does the determinant calculate?": "The determinant calculates the area scale factor of the transformation. If $\\det(M) = 0$, the 2D grid collapses into a 1D line or 0D point.",
    "How is rotation achieved?": "Rotation by an angle $\\theta$ is achieved using the rotation matrix $\\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$.",
    "Find the matrix eigenvalues": "Eigenvalues $\\lambda$ are found by solving the characteristic equation $\\det(M - \\lambda I) = 0$."
  },
  "integrals": {
    "What is the Fundamental Theorem?": "The Fundamental Theorem of Calculus links differentiation and integration: $\\int_a^b f(x) dx = F(b) - F(a)$, where $F'(x) = f(x)$.",
    "Explain lower vs upper sums": "Lower Riemann sums use the minimum value of $f(x)$ in each subinterval (underestimating area), while upper sums use the maximum value (overestimating area).",
    "Integrate x² from -2 to 2": "The integral is $\\int_{-2}^2 x^2 dx = [\\frac{x^3}{3}]_{-2}^2 = \\frac{8}{3} - (-\\frac{8}{3}) = \\frac{16}{3} \\approx 5.33$."
  },

  // ==========================================
  // PHYSICS
  // ==========================================
  "motion": {
    "What if acceleration is added?": "Adding acceleration makes the position curve quadratic ($x = x_0 + v_0 t + \\frac{1}{2} a t^2$) and the velocity linear ($v = v_0 + at$).",
    "Explain the slope of distance vs time": "The slope of a distance-time graph represents velocity. A constant slope means constant velocity, while a changing curve represents acceleration.",
    "How is average velocity calculated?": "Average velocity is calculated as total displacement divided by total time: $v_{avg} = \\frac{\\Delta x}{\\Delta t}$."
  },
  "kinematics": {
    "Find maximum launch range": "The maximum launch range occurs at a launch angle of $\\theta = 45^\\circ$ (in the absence of air resistance), given by $R_{max} = v_0^2 / g$.",
    "What if gravity shifts to 1.6m/s²?": "On the Moon ($g \\approx 1.62\\text{ m/s}^2$), the downward acceleration is much lower, meaning the projectile will travel much higher and further for the same launch velocity.",
    "How is vertical speed modeled?": "Vertical speed is modeled by $v_y(t) = v_0 \\sin\\theta - gt$. It decreases linearly, reaches $0$ at the peak, and becomes negative as the projectile falls."
  },
  "forces": {
    "Calculate normal force": "The normal force acting perpendicular to the inclined plane is $F_N = mg \\cos\\theta$.",
    "What shifts acceleration to 0?": "Acceleration becomes zero when the parallel component of gravity matches the frictional force: $mg \\sin\\theta = F_f$, resulting in constant velocity.",
    "Explain static vs kinetic friction": "Static friction prevents a stationary object from moving ($F_{fs} \\le \\mu_s F_N$), while kinetic friction resists an object already in motion ($F_{fk} = \\mu_k F_N$)."
  },
  "waves": {
    "Show complete destructive interference": "Complete destructive interference occurs when two waves of equal frequency and amplitude meet exactly out of phase ($180^\\circ$ phase difference), canceling each other out to a flat line.",
    "What are nodes and antinodes?": "In a standing wave, nodes are points of zero amplitude (complete destructive interference), and antinodes are points of maximum amplitude (constructive interference).",
    "How do standing waves form?": "Standing waves form when two identical waves traveling in opposite directions interfere, creating a steady pattern of nodes and antinodes."
  },
  "oscillations": {
    "Calculate oscillation frequency": "The frequency of oscillation is given by $f = \\frac{1}{2\\pi} \\sqrt{\\frac{k}{m}}$, where $k$ is the spring constant and $m$ is the mass.",
    "Show conservation of spring energy": "Total energy is conserved: $E = E_{kinetic} + E_{potential} = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2$. Energy sloshes back and forth between kinetic and potential forms.",
    "What is restoring force formula?": "The restoring force is modeled by Hooke's Law: $F_s = -kx$, where $x$ is the displacement from equilibrium."
  },
  "electricity": {
    "Show schematic electron flow rate": "Electrons flow from the negative terminal to the positive terminal of the battery. The current $I = V/R$ determines the electron flow rate.",
    "Calculate power dissipated (P=VI)": "Power dissipated by the resistor is given by $P = VI = I^2R = V^2/R$.",
    "What is conductivity?": "Conductivity is the measure of a material's ability to conduct electric current, the inverse of resistivity: $\\sigma = 1/\\rho$."
  },

  // ==========================================
  // CHEMISTRY
  // ==========================================
  "atomic structure": {
    "Calculate energy level transition (Rydberg)": "The energy of the emitted or absorbed photon is calculated by the Rydberg formula: $\\Delta E = 13.6 \\left(\\frac{1}{n_{final}^2} - \\frac{1}{n_{initial}^2}\\right)\\text{ eV}$.",
    "Why did quantum mechanics replace Bohr?": "The Bohr model could not explain the spectra of multi-electron atoms or the wave-particle duality of electrons, which led to Schrodinger's wave equations.",
    "State orbital radius of ground state": "The orbital radius of the ground state of hydrogen ($n=1$) is the Bohr radius: $r_1 \\approx 0.529\\text{ Å}$."
  },
  "bonding": {
    "What defines bond energy?": "Bond energy is the amount of work required to break the covalent bond and separate the atoms. It corresponds to the depth of the potential well at the equilibrium distance.",
    "Compare single vs double bonds": "Double bonds share 4 electrons (1 sigma, 1 pi bond), making them shorter and stronger (higher bond energy) than single bonds which share 2 electrons.",
    "How do ionic bonds form?": "Ionic bonds form through the electrostatic attraction between oppositely charged ions created by the transfer of valence electrons from a metal to a non-metal."
  },
  "states of matter": {
    "What happens at critical point?": "At the critical point, the liquid and gas phases merge into a single supercritical fluid phase, and the boundary between liquid and gas disappears.",
    "Define latent heat of fusion": "The latent heat of fusion is the energy required to transition a substance from a solid to a liquid state at its melting point without changing its temperature.",
    "How does pressure affect phase changes?": "Increasing pressure generally raises the boiling and melting points of substances (except water, where increased pressure lowers the melting point)."
  },
  "thermodynamics": {
    "How do catalysts lower Ea?": "Catalysts lower the activation energy by providing an alternative reaction pathway with a lower energy barrier, accelerating the reaction rate.",
    "Show endothermic energy profile": "In an endothermic reaction, products have higher enthalpy than reactants, so $\\Delta H$ is positive and heat is absorbed.",
    "Define Gibbs Free Energy": "Gibbs Free Energy ($G$) determines reaction spontaneity: $\\Delta G = \\Delta H - T\\Delta S$. A negative $\\Delta G$ indicates a spontaneous reaction."
  },
  "equilibrium": {
    "How does temp shift Kc?": "According to Le Chatelier's principle, increasing temp shifts endothermic reactions forward (increasing $K_c$) and exothermic reactions backward (decreasing $K_c$).",
    "Explain pressure effects on gas equilibrium": "Increasing pressure shifts the equilibrium toward the side with fewer gas moles to reduce stress.",
    "Define reaction quotient Q": "The reaction quotient $Q$ is the ratio of product to reactant concentrations at any point in time. If $Q < K_c$, the reaction shifts forward; if $Q > K_c$, it shifts backward."
  },
  "acids and bases": {
    "Find hydrogen ion concentration": "The hydrogen ion concentration is calculated from pH: $[H^+] = 10^{-\\text{pH}}$.",
    "Explain weak acid buffer solutions": "A buffer solution consists of a weak acid and its conjugate base. It resists changes in pH when small amounts of acid or base are added.",
    "What is pKa and pKb?": "They are logarithmic dissociation constants: $\\text{p}K_a = -\\log(K_a)$ and $\\text{p}K_b = -\\log(K_b)$. A lower $\\text{p}K_a$ indicates a stronger acid."
  },
  "electrochemistry": {
    "Show schematic electron flow zinc-copper": "Electrons flow spontaneously from the zinc anode (oxidation: $Zn \\to Zn^{2+} + 2e^-$) through the wire to the copper cathode (reduction: $Cu^{2+} + 2e^- \\to Cu$).",
    "What does salt bridge balance?": "The salt bridge maintains electrical neutrality by allowing anions to flow to the anode half-cell and cations to flow to the cathode half-cell.",
    "Calculate Gibbs Free Energy deltaG": "Gibbs Free Energy is linked to cell potential: $\\Delta G = -nFE^\\circ_{cell}$, where $F$ is Faraday's constant and $n$ is the number of moles of electrons transferred."
  },
  "molecular structure": {
    "Explain oxygen hybridization": "The oxygen atom in water undergoes $sp^3$ hybridization, forming 4 hybrid orbitals (2 pointing to hydrogen atoms, 2 containing lone pairs).",
    "Why are lone pair repulsions strong?": "Lone pairs are closer to the oxygen nucleus and occupy more space than bonding pairs, squeezing the $H-O-H$ bond angle down from $109.5^circ$ to $104.5^\\circ$.",
    "What is the net dipole value?": "The net dipole moment of water is $\\mu \\approx 1.85\\text{ D}$, pointing toward the highly electronegative oxygen atom."
  },

  // ==========================================
  // BIOLOGY
  // ==========================================
  "cells": {
    "What is the function of chloroplast?": "Chloroplasts conduct photosynthesis, capturing light energy to synthesize glucose from carbon dioxide and water.",
    "Compare plant cells and animal cells": "Plant cells have a rigid cell wall, chloroplasts, and a large central vacuole, which animal cells lack.",
    "What is the cell wall composition?": "The plant cell wall is primarily composed of cellulose, a polysaccharide forming rigid microfibrils."
  },
  "biomolecules": {
    "Describe hydrogen bonding in base pairs": "Adenine pairs with Thymine via 2 hydrogen bonds, while Guanine pairs with Cytosine via 3 hydrogen bonds.",
    "What are purines vs pyrimidines?": "Purines (Adenine, Guanine) have a double-ring structure, whereas Pyrimidines (Thymine, Cytosine) have a single-ring structure.",
    "How do transcription bubbles open?": "RNA polymerase breaks the hydrogen bonds between complementary base pairs, unwinding the DNA helix to expose the template strand."
  },
  "plant biology": {
    "Explain water photolysis in Photosystem II": "Water photolysis splits water: $2H_2O \\to 4H^+ + 4e^- + O_2$. This releases oxygen gas and provides electrons for the electron transport chain.",
    "What is the RuBisCO carbon fixation role?": "RuBisCO catalyzes the carboxylation of RuBP with $CO_2$, initiating the Calvin cycle to build sugars.",
    "Show limiting rate curve": "As light intensity or $CO_2$ concentration increases, the photosynthetic rate rises until it plateaus, limited by enzyme saturation or temperature."
  },
  "ecology": {
    "Why are food chains short?": "Food chains are limited to 4-5 trophic levels because only about 10% of energy is transferred to the next level (the 10% rule), with 90% lost as metabolic heat.",
    "Define biomagnification of toxins": "Biomagnification is the increasing concentration of persistent, fat-soluble toxins in the tissues of organisms at higher trophic levels.",
    "What is primary productivity?": "Primary productivity is the rate at which solar energy is converted into organic compounds by autotrophs (producers) in an ecosystem."
  },
  "human physiology": {
    "Show volume vs pressure loop (PV loop)": "A pressure-volume loop plots left ventricular pressure against volume, tracing filling, isovolumetric contraction, ejection, and isovolumetric relaxation.",
    "Explain stroke volume and cardiac output": "Stroke volume ($SV$) is the blood ejected per beat ($SV = EDV - ESV$). Cardiac Output ($CO$) is the total volume pumped per minute ($CO = SV \\times HR$).",
    "What triggers heart sounds?": "The first sound (lub) is triggered by the closure of the AV valves (mitral/tricuspid) at systole. The second sound (dub) is triggered by the closure of the semilunar valves (aortic/pulmonic) at diastole."
  },
  "nervous system": {
    "How do calcium ions trigger vesicle release?": "When an action potential depolarizes the presynaptic terminal, voltage-gated calcium channels open. The influx of $Ca^{2+}$ triggers synaptic vesicles to fuse with the membrane and release neurotransmitters.",
    "Explain depolarization in action potentials": "Depolarization is caused by the rapid opening of voltage-gated sodium channels, allowing $Na^+$ ions to rush into the neuron and flip the membrane potential positive.",
    "Show receptor saturation curve": "As neurotransmitter concentration in the cleft increases, postsynaptic receptor binding increases until all receptors are saturated, plateauing the response."
  }
};
