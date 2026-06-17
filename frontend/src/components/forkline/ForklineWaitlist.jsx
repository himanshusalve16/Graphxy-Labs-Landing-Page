import React from 'react';
import WaitlistForm from '../ui/WaitlistForm';

export default function ForklineWaitlist() {
  return (
    <WaitlistForm
      formId={import.meta.env.VITE_FORMSPREE_FORKLINE_ID}
      accentColor="#92400E"
      accentBg="#FEF7EC"
      accentRing="#FEF3E2"
      buttonVariant="forkline"
      buttonLabel="Join Forkline Waitlist"
      emailPlaceholder="Enter your restaurant email address..."
      subject="New Forkline Waitlist Signup"
      buildMessage={(name) => `${name} has joined the Forkline developer waitlist.`}
      successTitle="You're on the list"
      successMessage="Thank you for joining. We've recorded your email and will reach out with early Forkline preview invitations soon."
    />
  );
}
