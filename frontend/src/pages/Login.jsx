import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * Premium Login Card View.
 * Binds credentials input using react-hook-form and handles responsive validations.
 */
export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      
      toast.success('Credentials verified! Verification OTP sent to email.', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        iconTheme: {
          primary: '#3b76f6',
          secondary: '#fff',
        },
      });
      
      // Redirect to OTP verification page, passing the email in location state
      navigate('/verify-login-otp', { state: { email: data.email } });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 relative z-10">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 relative overflow-hidden border-dark-700/40 shadow-2xl">
        {/* Glow Line decoration */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-600 to-primary-400" />

        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-display font-bold text-2xl text-white">Welcome Back</h2>
          <p className="text-xs text-dark-300">Enter credentials to securely sync your workspace.</p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            icon={Mail}
            error={errors.email}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address format',
              },
            })}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            icon={Lock}
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must satisfy 6 characters minimum',
              },
            })}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-2 h-11 text-xs gap-2"
          >
            <LogIn size={15} />
            <span>Authenticate Session</span>
          </Button>
        </form>

        {/* Footer Redirect anchor */}
        <div className="text-center pt-4 border-t border-dark-800/60">
          <p className="text-xs text-dark-400">
            Don't have a portal account yet?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
