import { useSignInEmailPassword, useSignUpEmailPassword, useSignOut, useUserId } from '@nhost/react';
import { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInEmailPassword, isLoading: signingIn, error: signInError } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: signingUp, error: signUpError } = useSignUpEmailPassword();
  const { signOut } = useSignOut();
  const userId = useUserId();

  return (
    <div>
      {!userId ? (
        <>
          <h2>Sign Up</h2>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
          <button onClick={() => signUpEmailPassword(email, password)} disabled={signingUp}>Sign Up</button>
          {signUpError && <div>{signUpError.message}</div>}

          <h2>Sign In</h2>
          <button onClick={() => signInEmailPassword(email, password)} disabled={signingIn}>Sign In</button>
          {signInError && <div>{signInError.message}</div>}
        </>
      ) : (
        <>
          <div>Signed in as {userId}</div>
          <button onClick={signOut}>Sign Out</button>
        </>
      )}
    </div>
  );
} 