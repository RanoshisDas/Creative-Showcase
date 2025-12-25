import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { getImageByUserName } from '../api/images';
import MasonryGrid from '../components/MasonryGrid';
import ImageModal from '../components/ImageModal';
import {useNavigate, useParams} from "react-router-dom";

const PublicUserPage = () => {
    const { username } = useParams();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) return;

        setLoading(true);
        setError("");

        getImageByUserName(username)
            .then(setImages)
            .catch(err => {
                console.error(err);
                setError("Failed to load images");
            })
            .finally(() => setLoading(false));
    }, [username]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <nav className="bg-white shadow p-4 flex items-center gap-4">
                <Home onClick={() => navigate('/')} className="cursor-pointer" />
                <h1 className="text-xl font-bold">@{username}</h1>
            </nav>

            {loading && <p className="text-center mt-8">Loading images...</p>}
            {error && <p className="text-center text-red-500 mt-8">{error}</p>}
            {!loading && images.length === 0 && <p className="text-center mt-8">No images found</p>}

            <MasonryGrid images={images} onImageClick={setSelectedImage} />
            <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
        </div>
    );
};

export default PublicUserPage;
