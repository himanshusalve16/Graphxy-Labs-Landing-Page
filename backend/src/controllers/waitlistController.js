exports.addToWaitlist = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    console.log(`[Express Backend] Waitlist Signup Registered: ${email}`);
    res.status(200).json({ success: true, message: "Successfully added to developer preview waitlist." });
  } catch (error) {
    console.error("Error in addToWaitlist:", error);
    res.status(500).json({ error: "Server database error. Try again later." });
  }
};
