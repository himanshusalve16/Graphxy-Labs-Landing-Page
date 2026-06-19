// Graphxy Labs — Formspree Integration
// All IDs must come from environment variables.
// See .env.example for required variable names.
// Set values in .env.local (not committed to version control).

/**
 * Submits form data to a Formspree endpoint.
 * @param {string} formId — The Formspree form ID from an env variable
 * @param {Object} data   — Form payload object
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function submitToFormspree(formId, data) {
  const id = (formId || '').trim();

  if (!id) {
    console.error('[Formspree] Missing form ID. Set VITE_FORMSPREE_CONTACT_ID or VITE_FORMSPREE_WAITLIST_ID in .env.local');
    return {
      success: false,
      error: 'Form configuration error. Please contact us directly at himanshusalve9@gmail.com.',
    };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { success: true };
    }

    const errData = await response.json().catch(() => ({}));
    return {
      success: false,
      error: errData.error || `Submission failed (HTTP ${response.status}). Please try again.`,
    };
  } catch (err) {
    console.error('[Formspree] Network error:', err);
    return {
      success: false,
      error: 'A network error occurred. Please verify your connection and try again.',
    };
  }
}
