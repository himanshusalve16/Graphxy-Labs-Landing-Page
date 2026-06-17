import React from 'react';
import WaitlistForm from '../ui/WaitlistForm';

export default function VentureFlowWaitlist() {
  return (
    <WaitlistForm
      formId={import.meta.env.VITE_FORMSPREE_VENTUREFLOW_ID}
      accentColor="#1B3A6B"
      accentBg="#EEF3FB"
      accentRing="#EEF3FB"
      buttonVariant="brand"
      buttonLabel="Join VentureFlow Waitlist"
      emailPlaceholder="Enter your work email address..."
      subject="New VentureFlow Waitlist Signup"
      buildMessage={(name) => `${name} has joined the VentureFlow developer waitlist.`}
      successTitle="You're on the list"
      successMessage="Thank you for joining. We've recorded your email and will reach out with early VentureFlow preview invitations soon."
    />
  );
}
