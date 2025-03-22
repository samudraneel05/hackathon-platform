"use client";
import React, { useEffect, useRef } from 'react';

const GoogleSignIn: React.FC = () => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // dynamically load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google && googleButtonRef.current) {
        (window as any).google.accounts.id.initialize({
          client_id: '857454556951-37rvmian7896dc822opdktrfpo28dn6d.apps.googleusercontent.com', // replace with your actual client ID
          callback: handleCredentialResponse,
        });
        (window as any).google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large' }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log('Encoded JWT ID token: ', response.credential);
    // Send the token to the backend for verification and further auth logic
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
      console.log('User authenticated:', data);
      // Implement further logic after successful authentication
    })
    .catch(err => {
      console.error('Authentication failed:', err);
    });
  };

  return <div ref={googleButtonRef} />;
};

export default GoogleSignIn; 