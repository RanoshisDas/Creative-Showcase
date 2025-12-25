import { useEffect, useState } from 'react';
import { Upload, LogOut, Home } from 'lucide-react';
import ImageModal from '../components/ImageModal';
import { getUserImages, uploadImage } from '../api/images';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {getCachedUser, logoutUser} from "../api/auth";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate?.("/login");      // redirect
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    const userData = getCachedUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setCheckingAuth(false);
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (!checkingAuth && !user) {
            navigate('/login');
        }
    }, [checkingAuth, user, navigate]);


    useEffect(() => {
        if (!user) return;
        getUserImages(user.uid).then(setImages);
    }, [user]);


    const uploadImages = (e) => {
        const file = e.target.files[0];
        if (!file || !title) {
            alert('Title required');
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await uploadImage(
                    file,
                    title,
                    userData
                );
                setTitle('');
                setImages(await getUserImages(user.uid));
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Failed to upload image.");
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // 6️⃣ Loader (AFTER hooks)
    if (checkingAuth) return null; // or spinner

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <nav className="bg-white p-4 shadow flex justify-between">
                <Home onClick={() => navigate('/')} className="cursor-pointer"/>
                <h1 className="text-xl font-bold">Welcome @{userData?.username}</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            const profileUrl = `${window.location.origin}/user/${userData?.username}`;
                            navigator.clipboard.writeText(profileUrl);
                            alert('Profile link copied to clipboard!');
                        }}
                        className="text-white hover:bg-sky-700 cursor-pointer bg-sky-600 px-4 py-2 rounded-lg"
                    >
                        Share Profile
                    </button>
                    <LogOut onClick={handleLogout} className="cursor-pointer text-red-600"/>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6">
                <input
                    className="border p-3 w-full mb-4 rounded-lg"
                    placeholder="Artwork title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

            <div className="flex items-center gap-4">
                <label className={`bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload size={18} className="mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={uploadImages}
                        disabled={isUploading}
                    />
                </label>
                {isUploading && (
                    <div className="flex items-center text-purple-600 animate-pulse">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {images.map((img) => (
                        <img
                            key={img.id}
                            src={img.imageUrl}
                            alt={img.title}
                            onClick={() => setSelectedImage(img)}
                            className="rounded-lg shadow cursor-pointer"
                        />

                    ))}
                </div>
            </div>

            <ImageModal
                image={selectedImage}
                user={userData}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
};

export default UserProfile;
