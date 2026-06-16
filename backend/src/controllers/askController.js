exports.processQuestion = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ error: "Type a question to get started (min 3 chars)." });
    }

    // Mock subject classifier & visual engine routing
    const q = query.toLowerCase();
    let subject = "math";
    let confidence = 0.95;
    let concepts = ["quadratic modeling"];
    let equation = "y = a * x^2";
    let keyIdea = "The leading coefficient 'a' dictates the vertical scale and opening direction of a quadratic parabola.";
    let summary = "Changing the stretch factor <code>a</code> alters how narrow or wide the parabola opens. If <code>|a| &gt; 1</code>, it grows narrower (steeper). If <code>0 &lt; |a| &lt; 1</code>, it widens. If <code>a</code> is negative, the parabola points downwards.";
    let sliders = [{ id: 'a', label: 'Stretch (a)', min: -5, max: 5, step: 0.1, val: 1.0 }];
    let followUps = ["What if a is negative?", "What is the vertex?", "Add a horizontal shift"];

    if (q.includes('sin') || q.includes('amplitude') || q.includes('wave') || q.includes('trig')) {
      subject = "math";
      concepts = ["trigonometric functions", "amplitude", "wave frequency"];
      equation = "y = a * \\sin(x)";
      keyIdea = "The amplitude stretch factor scaling the heights of trigonometric wave troughs and peaks.";
      summary = "Multiplying the sine function by a constant factor <code>a</code> scales the amplitude. A larger value stretches the wave vertically, while values between 0 and 1 compress it. A negative factor flips the wave across the x-axis.";
      sliders = [{ id: 'a', label: 'Amplitude (a)', min: -5, max: 5, step: 0.1, val: 1.0 }];
      followUps = ["What if amplitude is 0?", "What happens if a is negative?", "Show me cos(x) instead"];
    } else if (q.includes('cubic') || q.includes('x³') || q.includes('x^3') || q.includes('roots')) {
      subject = "math";
      concepts = ["polynomials", "cubic curves", "real roots"];
      equation = "y = x^3 - a * x";
      keyIdea = "Cubic polynomials have up to three real roots where the curve crosses the horizontal x-axis.";
      summary = "This cubic equation is of the form <code>y = x³ - ax</code>. The parameter <code>a</code> controls the separation of the local maximum and minimum. When <code>a &gt; 0</code>, the curve bends to form two turning points and three roots.";
      sliders = [{ id: 'a', label: 'Separation (a)', min: -2, max: 5, step: 0.1, val: 3.0 }];
      followUps = ["Where are the turning points?", "What if a is negative?", "Find root coordinates"];
    } else if (q.includes('shift') || q.includes('c') || q.includes('y = x² + c') || q.includes('y = x^2 + c')) {
      subject = "math";
      concepts = ["transformations", "vertical shift", "parabola vertex"];
      equation = "y = x^2 + c";
      keyIdea = "Adding a constant 'c' shifts the entire curve vertically along the y-axis without altering its shape.";
      summary = "In <code>y = x² + c</code>, <code>c</code> represents the vertical shift. When <code>c &gt; 0</code>, the parabola slides upwards. When <code>c &lt; 0</code>, it slides downwards. The vertex is always at <code>(0, c)</code>.";
      sliders = [{ id: 'c', label: 'Vertical Shift (c)', min: -5, max: 5, step: 0.1, val: 0.0 }];
      followUps = ["What if c is 0?", "Combine shift and stretch", "What is the domain?"];
    } else if (!q.includes('x') && !q.includes('y') && !q.includes('equation') && !q.includes('plot') && !q.includes('graph')) {
      // Non-math classification
      subject = "biology";
      confidence = 0.88;
      concepts = ["unsupported subject"];
      equation = "";
      keyIdea = "Non-Math Topic Explanation";
      summary = "Currently, Graphzy's interactive visualizers only support Math concepts. Chemistry molecules, Biology diagrams, and Physics simulations are in development. Here is the conceptual response: " + query;
      sliders = [];
      followUps = ["Check the Roadmap", "Return to Math"];
    }

    res.status(200).json({
      subject,
      confidence,
      concepts,
      topic: {
        topicKey: subject === "math" ? "custom" : "non_math",
        equation,
        keyIdea,
        summary,
        concepts,
        sliders,
        followUps
      }
    });
  } catch (error) {
    console.error("Error in processQuestion:", error);
    res.status(500).json({ error: "Internal AI processing error. Please try again." });
  }
};

exports.processFollowUp = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Follow-up text is required." });
    }

    // Heuristics for follow-up response
    let text = "Adjusting the parameters in the sliders panel helps visualize how this mathematical relationship changes.";
    res.status(200).json({ text });
  } catch (error) {
    console.error("Error in processFollowUp:", error);
    res.status(500).json({ error: "Internal processing error." });
  }
};
