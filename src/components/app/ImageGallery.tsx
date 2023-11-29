import React, { useState } from "react";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

interface ImageGalleryProps {
  imageUrls: string[];
}
const ImageGallery: React.FC<ImageGalleryProps> = ({ imageUrls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startSlice, setStartSlice] = useState(0);

  const handlePreviousClick = () => {
    setStartSlice((oldStartSlice) =>
      oldStartSlice > 0 ? oldStartSlice - 1 : oldStartSlice,
    );
  };

  const handleNextClick = () => {
    setStartSlice((oldStartSlice) =>
      oldStartSlice < imageUrls.length - 3 ? oldStartSlice + 1 : oldStartSlice,
    );
  };

  return (
    <div className="flex w-full flex-col items-center">
      <img
        className="mb-4 rounded-3xl"
        src={imageUrls[selectedImageIndex]}
        alt={`Image ${selectedImageIndex + 1}`}
      />
      <div className="flex w-full items-center justify-between">
        <button
          onClick={handlePreviousClick}
          disabled={startSlice === 0}
          className={`btn btn-circle btn-primary flex items-center justify-center ${
            startSlice === 0 ? "btn-disabled cursor-not-allowed opacity-50" : ""
          }`}
        >
          <ChevronLeftCircle className="h-8 w-8" />
        </button>
        <div className="flex space-x-4 overflow-x-auto">
          {imageUrls.slice(startSlice, startSlice + 3).map((url, index) => (
            <img
              key={index}
              className={`h-26 w-20 rounded-3xl object-cover ${
                index + startSlice === selectedImageIndex
                  ? "border-2 border-primary"
                  : ""
              }`}
              src={url}
              alt={`Thumbnail ${index + startSlice + 1}`}
              onClick={() => setSelectedImageIndex(index + startSlice)}
            />
          ))}
        </div>
        <button
          onClick={handleNextClick}
          disabled={startSlice === imageUrls.length - 3}
          className={`btn btn-circle btn-primary flex items-center justify-center ${
            startSlice === imageUrls.length - 3
              ? "btn-disabled cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          <ChevronRightCircle className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
