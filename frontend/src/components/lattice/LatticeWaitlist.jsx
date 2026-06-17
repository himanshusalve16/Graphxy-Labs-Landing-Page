import React from 'react';
import WaitlistForm from '../ui/WaitlistForm';

export default function LatticeWaitlist() {
  return (
    <WaitlistForm
      formId={import.meta.env.VITE_FORMSPREE_LATTICE_ID}
      accentColor="#1B3A6B"
      accentBg="#EEF3FB"
      accentRing="#EEF3FB"
      buttonVariant="brand"
      buttonLabel="Join Lattice Waitlist"
      emailPlaceholder="Enter your work email address..."
      subject="New Lattice Waitlist Signup"
      buildMessage={(name) => `${name} has joined the Lattice developer waitlist.`}
      successTitle="You're on the list"
      successMessage="Thank you for joining. We've recorded your email and will reach out with early Lattice preview invitations soon."
    />
  );
}
