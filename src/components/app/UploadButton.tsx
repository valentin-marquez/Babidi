import { MapPin, ImagePlus, ChevronLeft, ChevronRight, X, Files, Check, ChevronsDownUp, HelpCircle } from 'lucide-react';
import React, { Fragment, useState, useEffect } from 'react';
import { Transition, Dialog, Listbox } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';

// @ts-ignore
interface UploadButtonProps {
    onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => (
    <button
        className="btn btn-primary transition-all duration-300 transform hover:scale-110"
        onClick={onClick}
    >
        <ImagePlus className="h-5 w-5 stroke-current inline-block" />
        Publicar
    </button>
);

interface ImageModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    setSelectedImages: (images: File[]) => void;
    setSelectedImageIndex: (index: number) => void;
    selectedImages: File[];
    onNextButton?: () => void;
    handleBack?: () => void;
    step?: number;
}
const ImageModal: React.FC<ImageModalProps> = ({ isModalOpen, onClose, children, onNextButton, handleBack, step, setSelectedImages, setSelectedImageIndex, selectedImages, style }) => {

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto font-sora" onClose={onClose}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div style={style} className="flex flex-col mx-auto bg-base-200 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                            <div className='flex items-center justify-between w-full p-2 navbar'>
                                <div className="navbar-start">
                                    {step == 1 || step == 2 ? (
                                        <button onClick={handleBack} className='text-current btn-square font-semibold no-underline hover:no-underline capitalize brightness-125 btn  btn-sm transition-all duration-300 transform decoration-none hover:brightness-150'>
                                            <ChevronLeft className="h-5 w-5 stroke-current" />
                                        </button>
                                    ) : ""}
                                </div>
                                <div className="navbar-center">
                                    {
                                        step == 0 ? (
                                            <h3 className="text-current font-semibold text-md brightness-125 text-center">Crea una nueva publicación</h3>
                                        ) : step == 1 ? (
                                            <span className="text-current font-semibold text-md brightness-125 text-center">Revise las fotos</span>
                                        ) : (
                                            <span className="text-current font-semibold text-md brightness-125 text-center ">Información del objeto</span>
                                        )
                                    }
                                </div>
                                <div className="navbar-end">
                                    {
                                        step == 1 ? (
                                            <button onClick={onNextButton} className="btn btn-ghost text-primary capitalize">Siguiente</button>
                                        ) : (
                                            <button className='btn btn-square btn-sm btn-ghost' onClick={onClose} >
                                                <X className="h-5 w-5 stroke-current" />
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};


interface ImageContainerProps {
    image: string,
    onPrev: () => void;
    onNext: () => void;
    className?: string;
    children?: React.ReactNode;
    selectedImageIndex: number;
    selectedImages: File[];
    style?: React.CSSProperties;

}

const ImageContainer: React.FC<ImageContainerProps> = ({ image, onPrev, onNext, className, children, style, selectedImageIndex, selectedImages }) => (
    <div className="image-container relative w-full h-full container overflow-hidden" style={style}>
        <img
            src={image}
            alt="Selected"
            className="w-full h-full object-cover object-center transition-all duration-300 transform"
        />
        <div className="navigation absolute bottom-0 left-0 right-0 flex justify-between bg-opacity-50 bg-black p-2">
            <button
                className={`btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110 ${selectedImageIndex === 0 ? 'btn-disabled' : ''}`}
                onClick={selectedImageIndex === 0 ? undefined : onPrev}
            >
                <ChevronLeft className="inline-block h-5 w-5 stroke-current text-current" />
            </button>
            <div className="flex justify-center space-x-2 items-center">
                {selectedImages.map((_, index) => (
                    <span
                        key={index}
                        className={`inline-block h-2 w-2 rounded-full bg-current transition-all duration-300   ${selectedImageIndex === index ? 'bg-opacity-100 bg-primary' : 'bg-opacity-50'}`}
                    />
                ))}
            </div>
            <button
                className={`btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110 ${selectedImageIndex === selectedImages.length - 1 ? 'btn-disabled' : ''}`}
                onClick={selectedImageIndex === selectedImages.length - 1 ? undefined : onNext}
            >
                <ChevronRight className="inline-block h-5 w-5 stroke-current text-current" />
            </button>
        </div>
    </div>
);

interface UploadAreaProps {
    onDrop: (acceptedFiles: File[]) => void;
    isDragActive: boolean;
    selectedImages: File[];
    style?: React.CSSProperties;
}
const UploadArea: React.FC<UploadAreaProps> = ({ onDrop, isDragActive, selectedImages, style }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop,
    });

    return (
        <div
            {...getRootProps()}
            className={`font-sora flex flex-col items-center justify-center rounded-lg ${isDragActive ? 'bg-base-300' : 'hover:bg-base-300'
                } transition-all duration-300 cursor-pointer w-full h-full`}
            style={{ ...style, flex: 1 }}
        >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center space-y-4 h-full justify-center p-4 w-full'>
                {selectedImages.map((image, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        className="h-16 w-16 stroke-current rotate-12 transition-transform duration-300 transform hover:scale-110"
                    />
                ))}
                <ImagePlus className="h-16 w-16 stroke-current rotate-12 transition-transform duration-300 transform" />
                <p className="text-neutral text-sm transition-opacity duration-300 opacity-70 hover:opacity-100">
                    Arrastra las fotos aquí
                </p>
                <div className="text-center">
                    <input {...getInputProps()} />
                    <button
                        type="button"
                        className="btn btn-sm btn-primary transition-all duration-300 transform no-animation"
                    >
                        Seleccionar desde el dispositivo
                    </button>
                </div>
            </div>
        </div >
    );
};


type Post = {
    title: string;
    description: string;
    status: string | "nuevo" | "casi usado" | "usado" | "muy usado";
    category_id?: number;
    emoji?: string;
    busca_descripcion?: string;
    author_id?: string;
};



interface InformationFormProps {
    onSubmit: (data: Post) => void;
    profile: { profile: { username: string, full_name: string, status: string, initials: string } }
    clientid: string;
    categories: { categories: string[] };
    statuses?: string[] | ["nuevo", "casi usado", "usado", "muy usado"];
}



const InformationForm: React.FC<InformationFormProps> = ({ onSubmit, profile, clientid, categories, statuses = ["nuevo", "casi usado", "usado", "muy usado"] }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('usado');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [emoji, setEmoji] = useState('');
    const [busca_descripcion, setBusca_descripcion] = useState('');
    const [author_id, setAuthor_id] = useState(clientid);


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({ title, description, status });
    };



    return (
        <>
            <div className='divider p-0 m-0' />
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div className='flex flex-row items-center gap-4'>
                    <div className='avatar placeholder'>
                        <div className='bg-primary text-neutral-content rounded-full w-10'>
                            <span className='text-sm'>{profile.profile.initials}</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className='font-semibold capitalize text-sm text-current'>{profile.profile.full_name}</span>
                        <span className='font-semibold text-xs text-neutral'>@{profile.profile.username}</span>
                    </div>
                </div>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titulo" className="w-full input input-bordered " />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Cuentanos sobre el objeto" className="textarea w-full"
                    maxLength={200}
                    style={{ resize: 'none' }}

                />
                <div className='flex flex-row items-center gap-4'>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text text-xs">Categoria del Objeto</span>
                            <span className='tooltip tooltip-primary tooltip-top cursor-help' data-tip="La categoria nos ayuda a clasificar el objeto, para que sea mas facil de encontrar.">
                                <HelpCircle className="h-4 w-4 stroke-current inline-block" />
                            </span>
                        </label>
                        <select className="select select-bordered w-full" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                            <option disabled value="">Seleccione</option>
                            {categories.categories.map((category: string, index: number) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text text-xs">Estado del objeto</span>
                            <span className='tooltip tooltip-primary tooltip-left cursor-help' data-tip="
                                El estado del objeto es una forma de describir el estado en el que se encuentra el objeto,
                                si es nuevo, casi nuevo, usado o muy usado.">
                                <HelpCircle className="h-4 w-4 stroke-current inline-block" />
                            </span>
                        </label>
                        <select className="select select-bordered w-full" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                            <option disabled value="">Seleccione</option>
                            {statuses.map((status: string, index: number) => (
                                <option key={index} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full btn btn-primary">Publicar</button>
            </form >
        </>
    );
};

const PostButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [step, setStep] = useState(0);
    const profile = JSON.parse(localStorage.getItem('profile') || '{}' as string);
    const clientid = localStorage.getItem('clientid') || '';
    const categories = JSON.parse(localStorage.getItem('categories') || '{}' as string);


    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSubmit = (data: any) => {
        console.log(data);
        handleCloseModal(); // Close the modal after form submission
    };

    const handleDrop = (acceptedFiles: File[]) => {
        setSelectedImages(acceptedFiles.slice(0, 10).map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        setStep(1); // Move to the next step after images are uploaded
    };

    const handlePrev = () => setSelectedImageIndex(prevIndex => prevIndex - 1);
    const handleNext = () => setSelectedImageIndex(prevIndex => prevIndex + 1);
    const handleNextButton = () => { setStep(2); } // Move to the next step when the "Next" button is clicked
    const handleBack = () => {
        if (step === 1) {
            setStep(0);
            // delete selectedImages[selectedImageIndex];
            setSelectedImages([]);
            setSelectedImageIndex(0);

        } else if (step === 2) {
            setStep(1);
        }
    }


    return (
        <div>
            <UploadButton onClick={handleOpenModal} />
            <ImageModal
                isModalOpen={isModalOpen}
                onClose={handleCloseModal}
                setSelectedImages={setSelectedImages}
                setSelectedImageIndex={setSelectedImageIndex}
                selectedImages={selectedImages}
                onNextButton={handleNextButton}
                handleBack={handleBack}
                step={step}
                style={{
                    maxHeight: '898px',
                    maxWidth: '855px',
                    minHeight: '391px',
                    minWidth: '348px',
                    width: '432px',
                }}
                className="modal-box rounded-md font-sora flex flex-col py-2 px-4 transition-all duration-300"
            >
                {step === 0 && (
                    <UploadArea
                        onDrop={handleDrop}
                        isDragActive={false}
                        selectedImages={selectedImages}
                        style={{
                            flex: 1,
                            minHeight: '391px',
                            minWidth: '348px',
                            width: '432px',
                        }}
                    />
                )}
                {step === 1 && (
                    <ImageContainer
                        image={selectedImages[selectedImageIndex]?.preview}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        className="image-container"
                        selectedImageIndex={selectedImageIndex}
                        selectedImages={selectedImages}
                        style={{
                            maxHeight: '898px',
                            maxWidth: '855px',
                            minHeight: '391px',
                            minWidth: '348px',
                            width: '432px',
                            height: '432px',
                        }}
                    >
                        <img
                            src={selectedImages[selectedImageIndex]?.preview}
                            alt={`Selected ${selectedImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="navigation">
                            <button
                                className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
                                onClick={handlePrev}
                            >
                                <ChevronLeft className="h-5 w-5 stroke-current" />
                            </button>
                            <button
                                className="btn btn-ghosts btn-sm transition-all duration-300 transform hover:scale-110"
                                onClick={handleNext}
                            >
                                <ChevronRight className="h-5 w-5 stroke-current" />
                            </button>
                        </div>
                    </ImageContainer>
                )}
                {step === 2 && (
                    <InformationForm onSubmit={handleSubmit} profile={profile} clientid={clientid} categories={categories} />
                )}
            </ImageModal>
        </div>
    );
}



export default PostButton;

