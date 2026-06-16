import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Key, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ROUTES } from '@/constants';

export default function VerifyLoginOtp() {
  const { verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Retrieve email from routing state if redirected from login page
  const prefilledEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: prefilledEmail,
      otp: '',
    },
  });

  useEffect(() => {
    if (prefilledEmail) {
      setValue('email', prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await verifyLoginOtp(data.email, data.otp);
      toast.success('Access authorized! Welcome back.');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error.message || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative z-10">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full border-dark-700/40 shadow-2xl flex flex-col gap-6 text-left">
        
        {/* Header Visual */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 bg-accent-amber/10 text-accent-amber rounded-2xl">
            <ShieldAlert size={28} />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">Login Verification</h2>
          <p className="text-xs text-dark-300 max-w-[280px]">
            Please enter your email and the 6-digit verification code sent to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. name@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="6-Digit Verification OTP"
            placeholder="e.g. 123456"
            error={errors.otp?.message}
            {...register('otp', {
              required: 'Verification code is required',
              minLength: {
                value: 6,
                message: 'OTP must be 6 digits',
              },
              maxLength: {
                value: 6,
                message: 'OTP must be 6 digits',
              },
            })}
            leftIcon={<Key size={16} />}
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full h-11 text-xs font-semibold uppercase tracking-wider mt-2"
          >
            Authorize and Login
          </Button>
        </form>

        <div className="text-center text-xs text-dark-400 font-medium">
          Wrong details?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-400 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
