const inspectionService = require('../services/inspection.service');
const { resolveOrganizationId } = require('../utils/orgResolver');

exports.inspect = async (req, res) => {
  const { text, provider = 'chatgpt', source = 'gateway' } = req.body;

  if (text === undefined) {
    return res.status(400).json({ error: "Prompt 'text' field is required." });
  }

  try {
    const organizationId = req.organizationId;
    const gatewayKeyId = req.gatewayKeyId;
    
    const decision = await inspectionService.inspectPrompt(text, {
      organizationId,
      gatewayKeyId,
      source,
      provider
    });
    
    res.status(200).json({
      success: true,
      data: decision
    });
  } catch (error) {
    console.error("Error in inspect controller:", error.message);
    res.status(500).json({ error: "Failed to inspect prompt." });
  }
};
