'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRole } from '@/lib/role-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your admin email.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' }),
      });
      const result = await res.json();

      if (result.success && result.data) {
        const loginRes = await login(email, password);
        if (loginRes.success) {
          router.push('/admin/users');
        } else {
          setError(loginRes.error || 'Failed to authenticate administrator account.');
        }
      } else {
        setError(result.error || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setError('Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden saasable-dot-bg font-sans">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#606BDF]/15 via-indigo-200/20 to-purple-200/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[440px] space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-4">
          <Link href="/" className="inline-flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#606BDF] text-white shadow-md shadow-[#606BDF]/30">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">AutoDoc</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Admin Console</p>
            </div>
          </Link>
        </div>

        <div className="saasable-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
          <div className="mb-6 flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#606BDF]/10 text-[#606BDF]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">Restricted Access</h1>
              <p className="text-xs text-slate-500">Authorized administrators only.</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@autodoc.com"
                  className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="font-display text-xs font-semibold text-slate-700 dark:text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 focus:border-[#606BDF] focus:ring-[#606BDF] bg-slate-50/50 dark:bg-slate-800/50 text-sm transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#606BDF] hover:bg-[#4F59C3] active:scale-[0.98] text-white font-semibold rounded-full text-sm shadow-md hover:shadow-lg hover:shadow-[#606BDF]/25 transition-all duration-200 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Admin Console'
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/login" className="text-xs text-slate-500 hover:text-[#606BDF] transition-colors font-medium">
              ← Back to standard login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
