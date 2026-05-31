'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../actions';
import { Building2, Loader2, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { SiToyota } from 'react-icons/si';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err === 'NotAdmin') {
        setError("You're not an admin. Access denied.");
      } else if (err === 'OAuthFailed') {
        setError("You're not an admin. Access denied.");
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsPending(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return (
    <div className="h-screen relative flex flex-col bg-[#fcfcfc] overflow-hidden selection:bg-red-100 selection:text-red-900">
      {/* Background Architectural Image */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <Image 
          src="/toyota-dealership-bg.png" 
          alt="Toyota Dealership Wireframe" 
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        
        {/* Subtle radial gradient to ensure card legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#fcfcfc_100%)] opacity-40"></div>
      </div>

      {/* Corporate Branding Top Left */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <div className="flex items-center space-x-2">
          <SiToyota className="w-8 h-8 text-[#EB0A1E]" />
          <h1 className="text-2xl font-bold tracking-tight text-[#EB0A1E]">TOYOTA</h1>
        </div>
        <p className="text-xs font-semibold tracking-widest text-gray-800 uppercase mt-0.5 ml-10">Nippon Toyota</p>
        <div className="w-8 h-1 bg-[#EB0A1E] mt-3 ml-10"></div>
      </div>

      {/* Main Authentication Card */}
      <div className="flex-1 flex items-center justify-center w-full relative z-10 py-4 px-4 sm:px-0">
        <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(235,10,30,0.05)] hover:bg-white/40">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-12 h-12 bg-[#EB0A1E] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-red-200">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Toyota HRMS</h2>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">Salary Slip Automation System</p>
            <div className="w-10 h-0.5 bg-[#EB0A1E] mt-4 opacity-80"></div>
          </div>

          <div className="bg-white/40 border border-white/50 rounded-xl p-3 mb-4 shadow-sm backdrop-blur-md">
            <h3 className="text-xs font-bold text-gray-800 mb-1 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EB0A1E] mr-2"></span>
              For Reviewers & Evaluation
            </h3>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              The login credentials have been automatically pre-filled. You can simply click "Sign In" to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-[#EB0A1E] p-3 rounded-lg text-sm border border-red-100 flex items-start animate-in fade-in slide-in-from-top-2">
                <span className="block">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#EB0A1E] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] outline-none transition-all placeholder:text-gray-400"
                  placeholder="admin@toyota.com"
                />
              </div>
              {errors.email && (
                <p className="text-[#EB0A1E] text-xs mt-1 animate-in fade-in">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#EB0A1E] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] outline-none transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#EB0A1E] text-xs mt-1 animate-in fade-in">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#EB0A1E] hover:bg-[#D0091A] active:bg-[#B00715] text-white font-medium text-sm py-3 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-200/50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">OR</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          {/* SSO Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isPending}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium text-sm py-3 rounded-xl transition-all flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <FcGoogle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Sign in with Google
            </button>
          </div>

          {/* Security Footer inside card */}
          <div className="mt-8 flex items-center justify-center text-gray-400 space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium tracking-wide">Secure enterprise authentication</span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-4 py-4 mt-auto">
        <div className="w-6 h-px bg-[#EB0A1E] mb-3 opacity-50"></div>
        <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide">
          © {new Date().getFullYear()} Nippon Toyota. All rights reserved.
        </p>
      </div>
    </div>
  );
}
