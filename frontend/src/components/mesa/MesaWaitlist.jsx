import React from 'react';
import WaitlistForm from '../ui/WaitlistForm';

export default function MesaWaitlist() {
  return (
    <WaitlistForm
      formId={import.meta.env.VITE_FORMSPREE_MESA_ID}
      accentColor="#92400E"
      accentBg="#FEF7EC"
      accentRing="#FEF3E2"
      buttonVariant="serva"
      buttonLabel="Join Mesa Waitlist"
      emailPlaceholder="Enter your restaurant email address..."
      subject="New Mesa Waitlist Signup"
      buildMessage={(name) => `${name} has joined the Mesa developer waitlist.`}
      successTitle="You're on the list"
      successMessage="Thank you for joining. We've recorded your email and will reach out with early Mesa preview invitations soon."
    />
  );
}
