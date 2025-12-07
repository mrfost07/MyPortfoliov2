"use client";
import { useState, useRef } from 'react';
import { supabase } from '@/utils/supabase-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const recaptchaRef = useRef(null);
    const router = useRouter();

    const handleCaptchaChange = (value) => {
        setCaptchaVerified(!!value);
    };

    const handleCaptchaExpired = () => {
        setCaptchaVerified(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!captchaVerified) {
            toast.error('Please complete the reCAPTCHA verification');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('Logged in successfully!');
            router.push('/admin/dashboard');
        } catch (error) {
            toast.error(error.message);
            // Reset reCAPTCHA on failed login
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setCaptchaVerified(false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0d1224]">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#1a202c] rounded-lg shadow-lg border border-[#2a3241]">
                <h2 className="text-3xl font-bold text-center text-white">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 text-white bg-[#0d1224] border border-[#2a3241] rounded-md focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 text-white bg-[#0d1224] border border-[#2a3241] rounded-md focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
                        />
                    </div>
                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                            onExpired={handleCaptchaExpired}
                            theme="dark"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !captchaVerified}
                        className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-pink-500 to-violet-600 rounded-md hover:from-pink-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16f2b3] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
