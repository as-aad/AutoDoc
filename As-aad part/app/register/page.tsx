'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Phone, Car, Store, Check, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRole, Role } from '@/lib/role-context';

const roles = [
  { value: 'customer' as Role, label: 'Customer', description: 'Need repairs', icon: User },
  { value: 'garage' as Role, label: 'Garage Owner', description: 'Manage shop', icon: Store },
  { value: 'mechanic' as Role, label: 'Mechanic', description: 'Repair vehicles', icon: Car },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rParam = searchParams.get('role');
    if (rParam === 'garage' || rParam === 'mechanic' || rParam === 'customer') {
      setSelectedRole(rParam as Role);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await registerUser({
        name,
        email,
        password,
        role: selectedRole,
        phone,
      });

      if (selectedRole === 'garage') {
        router.push('/garage/requests');
      } else if (selectedRole === 'mechanic') {
        router.push('/mechanic/workload');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] space-y-6 animate-in fade-in zoom-in-95 duration-500 relative z-10">
      {/* SaasAble Card Container */}
      <div className="saasable-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
        {/* Centered Logo */}
        <div className="flex justify-center mb-6 hover:scale-105 transition-transform duration-300">
          <Logo size={64} showTagline={false} />
        </div>

        {/* Archivo Display Headline */}
        <div className="text-center mb-8">
          <span className="saasable-pill mb-3">
            <span className="h-2 w-2 rounded-full bg-[#606BDF] animate-pulse" />
            Quick Registration
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Create your account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose your role to get started with AutoDoc
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role selector */}
          <div className="space-y-2">
            <Label className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Account Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const active = selectedRole === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={cn(
                      'relative rounded-2xl border p-3.5 text-left transition-all duration-200 flex flex-col justify-between h-full',
                      active
                        ? 'border-[#606BDF] bg-[#606BDF]/10 text-[#606BDF] shadow-sm scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-[#606BDF]/40 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {active && (
                      <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#606BDF]">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                    <Icon className={cn('h-5 w-5 mb-2 transition-colors', active ? 'text-[#606BDF]' : 'text-slate-400')} />
                    <p className="font-display font-semibold text-xs leading-tight">{r.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                placeholder="Jane Doe"
                className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="phone"
                  placeholder="+1 (555) 010-0199"
                  className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
                <span>Creating account...</span>
              </div>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </div>

      {/* Small link below card */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#606BDF] hover:text-[#4F59C3] underline-offset-4 hover:underline transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 py-12 bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
      {/* Scattered Automotive Line-Art Doodle Background */}
      <DoodleBackground />

      <Suspense fallback={<div className="h-96 w-full max-w-[500px] rounded-3xl bg-white/70 animate-pulse" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
