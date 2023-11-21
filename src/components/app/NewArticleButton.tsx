import React, { useState, useEffect, Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import { Transition, Dialog } from '@headlessui/react';
import { ImagePlus, ChevronLeft, ChevronRight, X } from 'lucide-react'; // Importa tus iconos aquí

import ArticleImages from '@app/ArticleImages';
import ArticleModal from '@app/ArticleModal';

const NewArticleButton: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    useEffect(() => {
        return () => {
            selectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
        };
    }, [selectedImages]);

    const handleButtonClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedImages([]);
        setCurrentStep(0);
        setSelectedImageIndex(0);
    };

    const handleNext = () => {
        if (currentStep < selectedImages.length - 1) {
            setSelectedImageIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setSelectedImageIndex((prevIndex) => prevIndex - 1);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            setSelectedImages(
                acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
            );
            setCurrentStep(0);
        },
    });

    return (
        <>
            <button
                className="btn btn-primary transition-all duration-300 transform hover:scale-110"
                onClick={handleButtonClick}
            >
                <ImagePlus className="inline-block h-5 w-5 stroke-current" />
                Publicar
            </button>

            <ArticleModal
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                selectedImages={selectedImages}
                currentStep={currentStep}
                selectedImageIndex={selectedImageIndex}
                handleNext={handleNext}
                handlePrev={handlePrev}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
            />
        </>
    );
};

export default NewArticleButton;
