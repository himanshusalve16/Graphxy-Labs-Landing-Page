// Formspree Form Configuration for Graphxy Labs
// Submissions route to himanshusalve9@gmail.com.
// Configure your Formspree Form IDs in your environment or in this file directly.

export const FORMSPREE_CONFIG = {
  // Read IDs from Vite environment variables or use default keys.
  MESA_WAITLIST_FORM_ID: import.meta.env.VITE_FORMSPREE_MESA_ID || "xrgpnopk", 
  VENTUREFLOW_WAITLIST_FORM_ID: import.meta.env.VITE_FORMSPREE_VENTUREFLOW_ID || "xrgpnotz", 
  CONTACT_FORM_ID: import.meta.env.VITE_FORMSPREE_CONTACT_ID || "mnqyeyza",
  
  targetEmail: "himanshusalve9@gmail.com"
};

/**
 * Submits form data directly to Formspree.
 * This function performs real network requests to the Formspree endpoint in all environments.
 * @param {string} formId - Formspree Form ID
 * @param {Object} data - Form payload
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function submitToFormspree(formId, data) {
  const id = (formId || "").trim();

  try {
    const response = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errData.error || `Submission failed with status ${response.status}. Please check your Formspree ID.` 
      };
    }
  } catch (error) {
    console.error("Formspree submission error:", error);
    return { 
      success: false, 
      error: "A network error occurred. Please verify your connection and try again." 
    };
  }
}

