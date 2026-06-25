const { db } = require('../../../db/clampbox/db');
const { waitlist } = require('../../../db/clampbox/schema/schema');

exports.addToWaitlist = async (req, res) => {
  const { email, name, company, role, teamSize, useCase } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  try {
    await db.insert(waitlist).values({
      email: email.toLowerCase().trim(),
      name: name || null,
      company: company || null,
      role: role || null,
      teamSize: teamSize || null,
      useCase: useCase || null,
      source: 'website',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(200).json({
      success: true,
      message: 'Successfully added to the Clampbox developer preview waitlist.'
    });
  } catch (error) {
    // Handle duplicate email gracefully
    if (error.message && error.message.includes('unique')) {
      return res.status(200).json({
        success: true,
        message: 'You are already on the waitlist. We will be in touch soon.'
      });
    }
    console.error('[Waitlist Controller] DB error:', error.message);
    res.status(503).json({ error: 'Failed to add to waitlist. Please try again.' });
  }
};
