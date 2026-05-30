'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '../actions';
import { Building2, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#EB0A1E] rounded-lg flex items-center justify-center mb-4">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Toyota HRMS</h1>
          <p className="text-gray-500 text-sm mt-2">Salary Slip Automation System</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">For Reviewers & Evaluation</h3>
          <p className="text-xs text-blue-600 leading-relaxed">
            The login credentials have been automatically pre-filled. You can simply click "Sign In" to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] outline-none transition-colors"
              placeholder="admin@toyota.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] outline-none transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#EB0A1E] hover:bg-[#D0091A] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FcGoogle className="w-5 h-5 mr-3" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Secure enterprise authentication
        </div>
      </div>
    </div>
  );
}
