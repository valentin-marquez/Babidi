import { MapPin, ImagePlus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { Fragment, useState, useEffect } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';


export function LocationButton({ children }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleButtonClick = () => {
        setModalOpen(true);
        // Aquí puedes agregar lógica adicional para manejar la apertura del modal
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // Aquí puedes agregar lógica adicional para manejar el cierre del modal
    };

    return (
        <>
            <button className="btn btn-ghost" onClick={handleButtonClick}>
                <MapPin className="inline-block h-5 w-5 stroke-current" />
                <div className="flex flex-col items-start capitalize">
                    <span className="text-xs">Cambiar tu</span>
                    <span className="text-sm lowercase">ubicación</span>
                </div>
            </button>


            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="modal-box rounded-md font-sora">
                                    <h3 className="text-current font-semibold text-xl brightness-125">Elige dónde vives</h3>
                                    <p className="text-neutral text-sm">
                                        Para poder mostrarte los intercambios más cercanos a ti, necesitamos saber dónde vives.
                                    </p>
                                    <div className="divider p-0 m-0"></div>
                                    <div className="modal-action">
                                        <form method="dialog" onSubmit={handleCloseModal}>
                                            <button type="submit" className="btn">
                                                Cerrar
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    );
};

export const NewArticleButton: React.FC = () => {
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
            'image/*': []
        },
        onDrop: (acceptedFiles) => {
            setSelectedImages(
                acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
            );
            setCurrentStep(0);
        },
    });

    const NewArticleModal = ({ isOpen, onClose }) => {
    }

    const ImageGallery = ({ images, selectedImageIndex, onNext, onPrev }) => (
        <div className="image-container">
            <img
                src={images[selectedImageIndex].preview}
                alt={`Selected ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
            />
            <div className="navigation">
                <button
                    className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
                    onClick={onPrev}
                >
                    <ChevronLeft className="inline-block h-5 w-5 stroke-current" />
                </button>
                <button
                    className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
                    onClick={onNext}
                >
                    <ChevronRight className="inline-block h-5 w-5 stroke-current" />
                </button>
            </div>
        </div>
    );

    const imageDropzone = ({ ondrop }) => {
        <div
            {...getRootProps()}
            onDragOver={(event) => {
                event.preventDefault();
            }}
            onDrop={(event) => {
                event.preventDefault();

                const files = event.dataTransfer.files;
                const acceptedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    if (files[i].type.startsWith('image/')) {
                        acceptedFiles.push(files[i]);
                    }
                }

                setSelectedImages(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));
            }}
            className={`flex-1 flex items-center justify-center border-2 border-neutral rounded-lg ${isDragActive ? 'bg-base-300 border-opacity-75' : 'hover:bg-base-300 border-opacity-50'
                } transition-all duration-300 cursor-pointer`}>
            <input {...getInputProps()} />
            <div className='flex flex-col items-center space-y-4'>
                {selectedImages.map((image) => (
                    <img
                        key={image}
                        src={image.preview}
                        alt="Selected"
                        className="h-16 w-16 stroke-current rotate-12 transition-transform duration-300 transform hover:scale-110"
                    />
                ))}
                <ImagePlus className="h-16 w-16 stroke-current rotate-12 transition-transform duration-300 transform hover:scale-110" />
                <p className="text-neutral text-sm transition-opacity duration-300 opacity-70 hover:opacity-100">
                    Arrastra las fotos aquí
                </p>
                <div className="text-center">
                    <input {...getInputProps()} />
                    <button
                        type="button"
                        className="btn btn-sm btn-primary transition-all duration-300 transform hover:scale-110"
                    >
                        Seleccionar desde el dispositivo
                    </button>
                </div>
            </div>
        </div>
    }

    // implement all before components


    // return (
    //     <>
    //         <button
    //             className="btn btn-primary transition-all duration-300 transform hover:scale-110"
    //             onClick={handleButtonClick}
    //         >
    //             <ImagePlus className="inline-block h-5 w-5 stroke-current" />
    //             Publicar
    //         </button>

    //         <Transition appear show={isModalOpen} as={Fragment}>
    //             <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
    //                 <Transition.Child
    //                     as={Fragment}
    //                     enter="ease-out duration-300"
    //                     enterFrom="opacity-0"
    //                     enterTo="opacity-100"
    //                     leave="ease-in duration-200"
    //                     leaveFrom="opacity-100"
    //                     leaveTo="opacity-0"
    //                 >
    //                     <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300" />
    //                 </Transition.Child>

    //                 <div className="fixed inset-0 overflow-y-auto">
    //                     <div className="flex min-h-full items-center justify-center text-center">
    //                         <Transition.Child
    //                             as={Fragment}
    //                             enter="ease-out duration-300"
    //                             enterFrom="opacity-0 scale-95"
    //                             enterTo="opacity-100 scale-100"
    //                             leave="ease-in duration-200"
    //                             leaveFrom="opacity-100 scale-100"
    //                             leaveTo="opacity-0 scale-95"
    //                         >
    //                             <div
    //                                 className="modal-box rounded-md font-sora flex flex-col py-2 px-4 transition-all duration-300"
    //                                 style={{
    //                                     maxHeight: '898px',
    //                                     maxWidth: '855px',
    //                                     minHeight: '391px',
    //                                     minWidth: '348px',
    //                                     width: '432px',
    //                                 }}
    //                             >
    //                                 {selectedImages.length > 0 && (
    //                                     <div className="image-container">
    //                                         <img
    //                                             src={selectedImages[selectedImageIndex].preview}
    //                                             alt={`Selected ${selectedImageIndex + 1}`}
    //                                             className="w-full h-full object-cover"
    //                                         />
    //                                         <div className="navigation">
    //                                             <button
    //                                                 className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
    //                                                 onClick={handlePrev}
    //                                             >
    //                                                 <ChevronLeft className="inline-block h-5 w-5 stroke-current" />
    //                                             </button>
    //                                             <button
    //                                                 className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
    //                                                 onClick={handleNext}
    //                                             >
    //                                                 <ChevronRight className="inline-block h-5 w-5 stroke-current" />
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                 )}
    //                                 <div className='inline-flex items-center justify-center'>
    //                                     <h3 className="text-current font-semibold text-lg brightness-125 text-center flex-1">Publica un nuevo artículo</h3>
    //                                     <button className='btn btn-ghosts btn-sm flex-0 transition-all duration-300 transform hover:scale-110'>
    //                                         <X className="inline-block h-5 w-5 stroke-current ml-auto cursor-pointer" onClick={handleCloseModal} />
    //                                     </button>
    //                                 </div>

    //                                 <div className="divider p-0 m-0 w-full" />

    //                                 <div
    //                                     {...getRootProps()}
    //                                     onDragOver={(event) => {
    //                                         event.preventDefault();
    //                                     }}
    //                                     onDrop={(event) => {
    //                                         event.preventDefault();

    //                                         const files = event.dataTransfer.files;
    //                                         const acceptedFiles = [];

    //                                         for (let i = 0; i < files.length; i++) {
    //                                             if (files[i].type.startsWith('image/')) {
    //                                                 acceptedFiles.push(files[i]);
    //                                             }
    //                                         }

    //                                         setSelectedImages(acceptedFiles.map(file => Object.assign(file, {
    //                                             preview: URL.createObjectURL(file)
    //                                         })));
    //                                     }}
    //                                     className={`flex-1 flex items-center justify-center border-2 border-neutral rounded-lg ${isDragActive ? 'bg-base-300 border-opacity-75' : 'hover:bg-base-300 border-opacity-50'
    //                                         } transition-all duration-300 cursor-pointer`}>
    //                                     <input {...getInputProps()} />
    //                                     <div className='flex flex-col items-center space-y-4'>
    //                                         {selectedImages.map((image) => (
    //                                             <img
    //                                                 key={image}
    //                                                 src={image.preview}
    //                                                 alt="Selected"
    //                                                 className="h-16 w-16 stroke-current rotate-12 transition-transform duration-300 transform hover:scale-110"
    //                                             />
    //                                         ))}
    //                                         <ImagePlus className="h-16 w-16 stroke-current rotate-12 transition-transform duration-300 transform hover:scale-110" />
    //                                         <p className="text-neutral text-sm transition-opacity duration-300 opacity-70 hover:opacity-100">
    //                                             Arrastra las fotos aquí
    //                                         </p>
    //                                         <div className="text-center">
    //                                             <input {...getInputProps()} />
    //                                             <button
    //                                                 type="button"
    //                                                 className="btn btn-sm btn-primary transition-all duration-300 transform hover:scale-110"
    //                                             >
    //                                                 Seleccionar desde el dispositivo
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </Transition.Child>
    //                     </div>
    //                 </div>
    //             </Dialog>
    //         </Transition>
    //     </>
    // );


};

