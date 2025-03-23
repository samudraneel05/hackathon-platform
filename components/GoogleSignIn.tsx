"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const GoogleSignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Use NextAuth's signIn method for Google
      await signIn('google', { callbackUrl: '/api/auth/session-redirect' });
      // The redirect will be handled by NextAuth through the callbacks.redirect function
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Sign In Failed',
        description: 'There was a problem signing in with Google.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">⭮</span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chrome"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="21.17" x2="12" y1="8" y2="8" />
          <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
          <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
        </svg>
      )}
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleSignIn;