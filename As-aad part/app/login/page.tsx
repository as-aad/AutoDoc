'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRole } from '@/lib/role-context';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);

      if (res.success) {
        const userRole = res.user?.role || 'customer';

        if (userRole === 'garage') {
          router.push('/garage/requests');
        } else if (userRole === 'mechanic') {
          router.push('/mechanic/workload');
        } else if (userRole === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(res.error || 'Account not found. Please register first.');
      }
    } catch (err: any) {
      setError('Authentication failed. Please check your email/password or register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
      {/* Scattered Automotive Line-Art Doodle Background */}
      <DoodleBackground />

      <div className="w-full max-w-[440px] space-y-6 animate-in fade-in zoom-in-95 duration-500 relative z-10">
        {/* SaasAble Card Container */}
        <div className="saasable-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
          {/* Logo component at top of card */}
          <div className="flex justify-center mb-6 hover:scale-105 transition-transform duration-300">
            <Logo size={64} showTagline={false} />
          </div>

          {/* Archivo Display Headline */}
          <div className="text-center mb-8">
            <span className="saasable-pill mb-3">
              <span className="h-2 w-2 rounded-full bg-[#606BDF] animate-pulse" />
              Secure Portal Access
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage your vehicle diagnostics & bookings
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="pl-11 pr-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#606BDF] hover:bg-[#4F59C3] active:scale-[0.98] text-white font-semibold rounded-full text-sm shadow-md hover:shadow-lg hover:shadow-[#606BDF]/25 transition-all duration-200 mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>

        {/* Switch Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-[#606BDF] hover:text-[#4F59C3] underline-offset-4 hover:underline transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
