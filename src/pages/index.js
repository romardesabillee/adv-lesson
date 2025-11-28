import axios from 'axios';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Both fields are required');
            return;
        }

        axios.post('/api/login', { email, password }).
            then((response) => {
                router.push('/u/dashboard');
            }).catch((error) => {
                setError(error.response?.data?.message || 'An error occurred');
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && (
                    <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
                )}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-gray-700 mb-2"
                    >
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
                <div className="mt-4 text-center">
                    <Link href="/register">
                        <span className="text-blue-600 hover:underline">Don't have an account? Register</span>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;