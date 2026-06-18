import React from 'react';
import WaitlistForm from '../ui/WaitlistForm';

export default function ClampboxWaitlist() {
  return (
    <WaitlistForm
      formId={import.meta.env.VITE_FORMSPREE_CLAMPBOX_ID}
      accentColor="#0D9488"
      accentBg="#F0F7F7"
      accentRing="rgba(13,148,136,0.15)"
      buttonVariant="clampbox"
      buttonLabel="Submit Clampbox Inquiry"
      emailPlaceholder="Enter your work email address..."
      subject="New Clampbox Inquiry"
      buildMessage={(name) => `${name} is interested in Clampbox confidential execution infrastructure.`}
      successTitle="You're on the list"
      successMessage="Thank you for joining. We've recorded your email and will reach out with early Clampbox preview invitations soon."
    />
  );
}
