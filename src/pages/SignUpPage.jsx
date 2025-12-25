import { useState } from 'react';
import { Camera } from 'lucide-react';
import {registerUser} from '../api/auth';
import {useNavigate} from "react-router-dom";

const SignUpPage = ({ onNavigate, setCurrentUser }) => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e?.preventDefault();

        setLoading(true);

        if (!form.username || !form.email || !form.password) {
            setError('Please enter all fields');
            setLoading(false);
            return;
        }

        if (
            form.username.length < 3 ||
            form.username.length > 20 ||
            form.username.includes(' ')
        ) {
            setError('Username must be 3–20 characters and contain no spaces');
            setLoading(false);
            return;
        }

        if (!form.email.includes('@')) {
            setError('Invalid email address');
            setLoading(false);
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters and must contain 1 A-Z, 1 a-z, 1 number, and 1 special character');
            setLoading(false);
            return;
        }

        try {
            const user = await registerUser(
                form.username,
                form.email,
                form.password
            );

            setCurrentUser(user);
        } catch (err) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <Camera className="mx-auto text-purple-600 mb-4" size={48} />
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
<form onSubmit={handleSignup}>
                <input
                    className="w-full mb-3 p-3 border rounded-lg"
                    placeholder="Username"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />

                <input
                    className="w-full mb-3 p-3 border rounded-lg"
                    placeholder="Email"
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />

                <input
                    type="password"
                    className="w-full mb-4 p-3 border rounded-lg"
                    placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
                >
                    {loading ? 'Creating...' : 'Sign Up'}
                </button>
</form>
                <p className="text-center mt-4">
                    Already registered?{' '}
                    <button  onClick={() => navigate('/login')} className="text-purple-600">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;