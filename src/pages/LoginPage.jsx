import { useState } from 'react';
import { Camera } from 'lucide-react';
import { loginUser } from '../api/auth';
import {useNavigate} from "react-router-dom";

const LoginPage = ({ onNavigate, setCurrentUser }) => {
    const [email, setEmail] = useState('');       // Use email, not username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await loginUser(email, password); // Firebase Auth expects email
            setCurrentUser(user);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <Camera className="mx-auto text-purple-600 mb-4" size={48} />
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

                <input
                    type="email"
                    className="w-full mb-4 p-3 border rounded-lg"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mb-4 p-3 border rounded-lg"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center mt-4">
                    No account?{' '}
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-purple-600 font-semibold"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
