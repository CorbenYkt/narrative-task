import React, { useState, useEffect, useRef } from 'react';
import { useGetImagesQuery, useGetFacesQuery } from '../services/imagesapi';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ImageList: React.FC = () => {
    const { data, error, isLoading } = useGetImagesQuery();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const images = data?.data || [];
    const currentImage = images[currentIndex] || null;
    const { data: faces } = useGetFacesQuery(currentImage?.id ?? '');
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const prevImage = () => {
        setImageLoading(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setImageLoading(true);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;
        setContextMenuPosition({ x, y });
        setShowContextMenu(true);
    };

    const handleClickOutside = () => {
        if (showContextMenu) {
            setShowContextMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showContextMenu]);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                prevImage();
            } else if (event.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [images.length]);


    if (isLoading)
        return (
            <div className="text-center text-lg">
                <div className="animate-spin h-32 w-32 border-7 border-gray-500 border-t-transparent rounded-full" />
            </div>
        );

    if (error)
        return (
            <p className="text-center text-lg text-red-500">There is an error loading images...</p>
        );

    if (!data?.data.length)
        return (
            <p className="text-center text-lg">No images available...</p>
        );

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#E5E5E5] relative">
            <div
                className="relative max-w-full h-full flex items-center justify-center"
                onContextMenu={handleContextMenu}
            >
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#E5E5E5]">
                        <div className="text-center text-lg">
                            <div className="animate-spin h-32 w-32 border-7 border-gray-500 border-t-transparent rounded-full" />
                        </div>
                    </div>
                )}

                <div>
                    <img
                        ref={imageRef}
                        src={currentImage.url}
                        alt={currentImage.filename}
                        className={`h-full max-h-[95vh] object-contain transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setImageLoading(false)}
                        loading="lazy"
                    />

                    {!imageLoading && faces?.data.map((face) => (
                        <div
                            key={face.id}
                            className="absolute border-2 border-white hover:border-red-500"
                            style={{
                                left: `${face.xmin * 100}%`,
                                top: `${face.ymin * 100}%`,
                                width: `${(face.xmax - face.xmin) * 100}%`,
                                height: `${(face.ymax - face.ymin) * 100}%`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-10 w-full max-w-3/4 bg-white p-5 text-center items-center rounded">
                <ArrowLeft
                    size={20}
                    strokeWidth={2}
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-500 hover:text-black hover:bg-gray-200"
                />
                <ArrowRight
                    size={20}
                    strokeWidth={2}
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-500 hover:text-black hover:bg-gray-200"
                />
                <p className="text-lg select-none">{currentImage.filename}</p>
            </div>

            {showContextMenu && (
                <div
                    className="absolute bg-white border border-gray-300 shadow-md rounded text-lg"
                    style={{
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                    }}
                >
                    <ul className="list-none p-2 m-0 rounded">
                        <li className="p-2 cursor-pointer hover:bg-black hover:text-white ">
                            Dummy Item
                        </li>
                        <li className="p-2 cursor-pointer hover:bg-black hover:text-white border-b border-gray-300">
                            This Does Nothing
                        </li>
                        <li className="p-2 cursor-pointer hover:bg-black hover:text-white border-b border-gray-300">
                            Fake News
                        </li>
                        <li className="p-2 cursor-pointer hover:bg-red-500 hover:text-white">
                            Delete Frame
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ImageList;
