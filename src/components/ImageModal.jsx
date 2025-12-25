import { X } from 'lucide-react';


const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button className="absolute top-4 right-4 text-white z-10">
                <X size={32} />
            </button>

            <div
                onClick={e => e.stopPropagation()}
                className="max-w-5xl w-full bg-white rounded-lg overflow-hidden"
            >
                <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full max-h-[70vh] object-contain bg-black"
                />

                <div className="p-6">
                    <h3 className="text-2xl font-bold">{image.title}</h3>
                    <p className="text-gray-600">by @{image.userName}</p>
                </div>
            </div>
        </div>

    );
};

export default ImageModal;
