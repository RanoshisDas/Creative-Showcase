const MasonryGrid = ({ images, onImageClick }) => (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 p-4">
        {images.map(image => (
            <div
                key={image.id}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all"
                onClick={() => onImageClick(image)}
            >
                <img
                    src={image.imageUrl || 'https://via.placeholder.com/300x200'}
                    alt={image.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 p-4 text-white">
                        <p className="font-semibold text-lg">{image.title}</p>
                        <p className="text-sm">by @{image.userName}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default MasonryGrid;
