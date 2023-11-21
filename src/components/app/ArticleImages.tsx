import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ArticleImages: React.FC = ({ selectedImages, selectedImageIndex, handlePrev, handleNext }) => {
    if (selectedImages.length === 0) {
        return null;
    }

    return (
        <div className="image-container">
            <img
                src={selectedImages[selectedImageIndex].preview}
                alt={`Selected ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
            />
            <div className="navigation">
                <button
                    className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
                    onClick={handlePrev}
                >
                    <ChevronLeft className="inline-block h-5 w-5 stroke-current" />
                </button>
                <button
                    className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
                    onClick={handleNext}
                >
                    <ChevronRight className="inline-block h-5 w-5 stroke-current" />
                </button>
            </div>
        </div>
    );
};

export default ArticleImages;
