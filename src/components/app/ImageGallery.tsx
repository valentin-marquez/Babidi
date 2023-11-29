import React, { useState } from "react";
import {
  ChevronLeftCircle,
  ChevronRightCircle,
  Fullscreen,
} from "lucide-react";
import { Transition } from "@headlessui/react";
import LightBox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ImageGalleryProps {
  imageUrls: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageUrls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startSlice, setStartSlice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };



  return (
    <div className="flex w-full flex-col items-center">
      <Transition
        as="div"
        show={true}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="relative mb-4 h-48 w-full rounded-3xl transition-all duration-500 ease-in-out sm:h-96"
      >
        <img
          style={{ borderRadius: "1.5rem" }}
          className="h-full w-full select-none object-cover"
          src={imageUrls[selectedImageIndex]}
          alt={`Image ${selectedImageIndex + 1}`}
        />
        <button
          onClick={() => handleImageClick(selectedImageIndex)}
          className="btn-primar btn btn-ghost absolute bottom-2 right-2 rounded-full text-neutral brightness-200 transition-all duration-200 ease-in-out"
        >
          <Fullscreen className="h-5 w-5" />
        </button>
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
              onClick={() => handleThumbnailClick(index + startSlice)}
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
      <LightBox
        open={isModalOpen}
        close={() => setIsModalOpen(false)}
        slides={imageUrls.map((url) => ({ src: url }))}
      />
    </div>
  );
};

export default ImageGallery;
