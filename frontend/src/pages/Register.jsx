import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * Premium Registration View.
 * Binds credentials input using react-hook-form and features a live password strength visualizer.
 */
export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    }
  });

  const passwordVal = watch('password', '');

  // Calculate Password strength complexity dynamically
  const getPasswordStrength = () => {
    if (!passwordVal) return { label: 'Empty', color: 'bg-dark-700', pct: '0%' };
    let score = 0;
    if (passwordVal.length >= 6) score++;
    if (/[A-Z]/.test(passwordVal)) score++;
    if (/[0-9]/.test(passwordVal)) score++;
    if (/[^A-Za-z0-9]/.test(passwordVal)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-accent-rose', pct: '25%' };
    if (score === 2) return { label: 'Medium', color: 'bg-accent-amber', pct: '50%' };
    if (score === 3) return { label: 'Strong', color: 'bg-primary-500', pct: '75%' };
    return { label: 'Excellent', color: 'bg-accent-emerald', pct: '100%' };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      
      toast.success('Account created successfully! Verification OTP sent to email.', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      });
      
      // Redirect to OTP verification page, passing the email in location state
      navigate('/verify-register-otp', { state: { email: data.email } });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.', {
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
        {/* Brand visual top highlight bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-emerald to-primary-500" />

        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-display font-bold text-2xl text-white">Create Account</h2>
          <p className="text-xs text-dark-300">Establish a secure node access card in Auth Demo App.</p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={User}
            error={errors.name}
            {...register('name', { required: 'Full name is required' })}
          />

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

          <div className="flex flex-col gap-1.5 w-full">
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
            
            {/* Live Strength Overlay */}
            {passwordVal && (
              <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-dark-400">
                  <span>Complexity:</span>
                  <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                </div>
                <div className="w-full h-1 bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.pct }} />
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            icon={Lock}
            error={errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === passwordVal || 'Passwords do not match',
            })}
          />

          {/* Terms checkbox */}
          <div className="flex flex-col gap-1 pl-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-left">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-dark-700 bg-dark-900 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-dark-900 h-4 w-4 shrink-0 transition-colors"
                {...register('agreeTerms', { required: 'You must agree to the Terms of Service' })}
              />
              <span className="text-[10px] text-dark-300 leading-normal">
                I agree to the{' '}
                <a href="#terms" className="text-primary-500 hover:text-primary-400 font-semibold underline transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-primary-500 hover:text-primary-400 font-semibold underline transition-colors">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-[10px] text-accent-rose font-medium pl-6">{errors.agreeTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-2 h-11 text-xs gap-2"
          >
            <UserPlus size={14} />
            <span>Generate Account Credentials</span>
          </Button>
        </form>

        {/* Footer redirection */}
        <div className="text-center pt-4 border-t border-dark-800/60">
          <p className="text-xs text-dark-400">
            Already have a portal card?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
