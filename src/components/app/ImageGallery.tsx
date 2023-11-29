import React, { useState } from "react";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Transition } from "@headlessui/react";

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
      <Transition
        as="div"
        show={true}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="mb-4 h-48 w-full rounded-3xl transition-all duration-500 ease-in-out sm:h-96"
      >
        <img
          style={{ borderRadius: "1.5rem" }}
          className="h-full w-full select-none object-cover"
          src={imageUrls[selectedImageIndex]}
          alt={`Image ${selectedImageIndex + 1}`}
        />
      </Transition>
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
        <div className="flex space-x-4 overflow-hidden">
          {imageUrls.slice(startSlice, startSlice + 3).map((url, index) => (
            <img
              key={index}
              className={`h-20 w-20 select-none rounded-3xl object-cover transition-all duration-200 ease-in-out hover:cursor-pointer ${
                index + startSlice === selectedImageIndex
                  ? "border-4 border-primary"
                  : " opacity-70 hover:scale-90 hover:border-2 hover:border-primary hover:opacity-100"
              }`}
              src={url}
              alt={`Thumbnail ${index + startSlice + 1}`}
              onClick={() => setSelectedImageIndex(index + startSlice)}
              style={{ imageRendering: "pixelated" }}
            />
          ))}
        </div>
        <button
          onClick={handleNextClick}
          disabled={startSlice >= imageUrls.length - 3}
          className={`btn btn-circle btn-primary flex items-center justify-center ${
            startSlice >= imageUrls.length - 3
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
