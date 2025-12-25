import { useEffect, useState } from 'react';
import { Camera, LogIn, UserPlus } from "lucide-react";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ImageModal from "../components/ImageModal";
import MasonryGrid from "../components/MasonryGrid";
import ProfileMenu from "../components/ProfileMenu";
import {getAllImages} from "../api/images";
import {getCachedUser, logoutUser} from "../api/auth";

const LandingPage = ( ) => {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const userData = getCachedUser();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await getAllImages();
                setImages(data || []);
            } catch (err) {
                console.error('Failed to fetch images:', err);
                setError('Failed to load images.');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    if (checkingAuth) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate?.("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-500">
                    <Camera /> Creative Showcase
                </h1>

                {/* Show Login/Signup ONLY if user is NOT logged in */}
                {!user && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            <LogIn /> Login
                        </button>

                        <button
                            onClick={() => navigate('/signup')}
                            className="flex items-center gap-1 bg-purple-500 text-white px-4 py-2 rounded-md"
                        >
                            <UserPlus /> Sign Up
                        </button>
                    </div>
                )}

                {/* Optional: show user info when logged in */}
                {user && (
                    <ProfileMenu
                        user={userData}
                        onProfile={() => navigate('/profile')}
                        onLogout={handleLogout}
                    />
                )}
            </nav>

            <main className="p-4">
                {loading && <p className="text-center text-gray-500">Loading images...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && images.length === 0 && (
                    <p className="text-center text-gray-600">No images available.</p>
                )}

                {/* Masonry Grid */}
                {!loading && images.length > 0 && (
                    <MasonryGrid images={images} onImageClick={setSelectedImage} />
                )}

                {/* Image Modal */}
                {selectedImage && (
                    <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
                )}
            </main>
        </div>
    );
};

export default LandingPage;
