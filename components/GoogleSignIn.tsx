"use client";

import React, { useEffect, useRef, useState } from 'react';

const GoogleSignIn: React.FC = () => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');

  useEffect(() => {
    console.log('GoogleSignIn component mounted');
    // Remove the client ID check since we know we have a real ID now
    const clientId = '857454556951-37rvmian7896dc822opdktrfpo28dn6d.apps.googleusercontent.com';
    console.log('Using client ID:', clientId);

    // dynamically load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    console.log('Google Sign-In script added to DOM');

    script.onload = () => {
      console.log('Google Sign-In script loaded successfully');
      try {
        if ((window as any).google && googleButtonRef.current) {
          console.log('Google object found and ref is available, initializing...');
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          });
          console.log('Google Sign-In initialized, rendering button...');
          (window as any).google.accounts.id.renderButton(
            googleButtonRef.current,
            { 
              theme: 'outline', 
              size: 'large',
              type: 'standard' 
            }
          );
          console.log('Button rendered');
          setStatus('Ready');
        } else {
          console.error('Google object or button ref not available', {
            googleExists: !!(window as any).google,
            refExists: !!googleButtonRef.current
          });
          setError('Failed to initialize: Google SDK or button container not available');
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
        setError(`Failed to initialize Google Sign-In: ${err}`);
      }
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Google Sign-In script', e);
      setError('Failed to load Google Sign-In script');
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log('Received credential response:', response);
    console.log('Encoded JWT ID token: ', response.credential);
    
    // Send the token to the backend for verification and further auth logic
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: response.credential })
    })
    .then(res => {
      console.log('Backend response status:', res.status);
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('User authenticated:', data);
      setStatus('Authenticated');
      // Implement further logic after successful authentication
    })
    .catch(err => {
      console.error('Authentication failed:', err);
      setError('Authentication failed. Please try again.');
    });
  };

  return (
    <div className="flex flex-col items-center">
      {status && <div className="text-gray-500 mb-1">{status}</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div ref={googleButtonRef} id="google-button" style={{ minHeight: '40px', minWidth: '200px' }} />
    </div>
  );
};

export default GoogleSignIn; 