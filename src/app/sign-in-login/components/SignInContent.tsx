'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Mode = 'options' | 'email-signin' | 'email-signup';

export default function SignInContent() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mode, setMode] = useState<Mode>('options');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setSuccessMsg('');
    setShowPassword(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle('/checkout');
      // Redirect handled by OAuth callback
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/checkout');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials') || msg.toLowerCase().includes('email not confirmed')) {
        setError('Incorrect email or password. If you signed up with Google, please use "Continue with Google" instead.');
      } else {
        setError(msg || 'Sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signUp(email, password, fullName);
      if (data.session) {
        // Auto-confirmed — redirect directly
        router.push('/checkout');
      } else {
        // Email confirmation required
        setSuccessMsg('Account created! Please check your email to confirm your account, then sign in.');
        setLoading(false);
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(msg || 'Sign-up failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const isEmailMode = mode === 'email-signin' || mode === 'email-signup';
  const isSignUp = mode === 'email-signup';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-3xl border border-border shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AppLogo size={40} />
              <span className="font-extrabold text-xl text-foreground">EaglesTech</span>
            </div>
            <h1 className="text-xl font-extrabold text-foreground text-center">
              {mode === 'options' ? 'Welcome' : isSignUp ? 'Create Account' : 'Sign in with Email'}
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {mode === 'options' ?'Sign in or create an account to continue'
                : isSignUp
                ? 'Fill in your details to get started' :'Enter your credentials to continue'}
            </p>
          </div>

          {mode === 'options' ? (
            <div className="space-y-3">
              {/* Google Sign-In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted hover:border-foreground/30 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email Sign In */}
              <button
                onClick={() => { resetForm(); setMode('email-signin'); }}
                className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted hover:border-foreground/30 active:scale-95 transition-all"
              >
                <Icon name="EnvelopeIcon" size={20} />
                Sign In with Email
              </button>

              {/* Email Sign Up */}
              <button
                onClick={() => { resetForm(); setMode('email-signup'); }}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-secondary active:scale-95 transition-all"
              >
                <Icon name="UserPlusIcon" size={20} />
                Create New Account
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                  <Icon name="ExclamationCircleIcon" size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Guest */}
              <div className="text-center pt-2">
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                >
                  Continue as Guest → Browse Shop
                </Link>
              </div>
            </div>
          ) : isSignUp ? (
            /* ── Sign Up Form ── */
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                  <Icon name="ExclamationCircleIcon" size={16} className="shrink-0" />
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-sm text-green-700">
                  <Icon name="CheckCircleIcon" size={16} className="shrink-0" />
                  {successMsg}
                </div>
              )}

              {!successMsg && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode('options'); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode('email-signin'); }}
                  className="text-sm text-primary font-semibold hover:underline transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          ) : (
            /* ── Sign In Form ── */
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                  <Icon name="ExclamationCircleIcon" size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-secondary active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode('options'); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to sign-in options
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode('email-signup'); }}
                  className="text-sm text-primary font-semibold hover:underline transition-colors"
                >
                  New user? Sign up
                </button>
              </div>
            </form>
          )}

          {/* Admin notice */}
          <div className="mt-6 p-3 bg-muted rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="StarIcon" size={14} variant="solid" className="text-accent" />
              <span className="text-xs font-bold text-foreground">Admin Access</span>
            </div>
            <p className="text-xs text-muted-foreground">
              As the business owner, use the{' '}
              <Link href="/admin-login" className="text-primary underline">Admin Login</Link>{' '}
              page to access the dashboard.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to EaglesTech&apos;s{' '}
          <Link href="#" className="underline hover:text-primary">Terms of Service</Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}