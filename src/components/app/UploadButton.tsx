import {
  MapPin,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  X,
  Files,
  Check,
  ChevronsDownUp,
  HelpCircle,
} from "lucide-react";
import React, { Fragment, useState, useEffect } from "react";
import { Transition, Dialog, Listbox } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import { supabase } from "@lib/supabase-client";
import { DoubleSpinner, CompletionAnimation } from "@components/Utils";

// @ts-ignore
interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => (
  <button
    className="btn btn-primary btn-sm transform transition-all duration-300 md:btn-md hover:scale-110"
    onClick={onClick}
  >
    <ImagePlus className="inline-block h-5 w-5 stroke-current" />
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
  isCompleted?: boolean;
  isLoading?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isModalOpen,
  onClose,
  children,
  onNextButton,
  handleBack,
  step,
  setSelectedImages,
  setSelectedImageIndex,
  selectedImages,
  style,
  isCompleted,
  isLoading,
}) => {
  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto font-sora"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              onClick={onClose}
              className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
            />
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
            <div
              style={style}
              className="mx-auto flex transform flex-col rounded-lg bg-base-200 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="navbar flex w-full items-center justify-between p-2">
                <div className="navbar-start">
                  {(step == 1 || step == 2) && !isCompleted && !isLoading ? (
                    <button
                      onClick={handleBack}
                      className="decoration-none btn btn-square btn-sm transform font-semibold capitalize text-current  no-underline brightness-125 transition-all duration-300 hover:no-underline hover:brightness-150"
                    >
                      <ChevronLeft className="h-5 w-5 stroke-current" />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="navbar-center">
                  {step == 0 ? (
                    <h3 className="text-md text-center font-semibold text-current brightness-125">
                      Crea una nueva publicación
                    </h3>
                  ) : step == 1 ? (
                    <span className="text-md text-center font-semibold text-current brightness-125">
                      Revise las fotos
                    </span>
                  ) : (
                    <span className="text-md text-center font-semibold text-current brightness-125 ">
                      Información del objeto
                    </span>
                  )}
                </div>
                <div className="navbar-end">
                  {step == 1 && !isLoading ? (
                    <button
                      onClick={onNextButton}
                      className="btn btn-ghost capitalize text-primary"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      className="btn btn-square btn-ghost btn-sm"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      <X className="h-5 w-5 stroke-current" />
                    </button>
                  )}
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
  image: string;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  children?: React.ReactNode;
  selectedImageIndex: number;
  selectedImages: File[];
  style?: React.CSSProperties;
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  image,
  onPrev,
  onNext,
  className,
  children,
  style,
  selectedImageIndex,
  selectedImages,
}) => (
  <div
    className="image-container container relative h-full w-full"
    style={style}
  >
    <img
      src={image}
      alt="Selected"
      className="h-full w-full transform object-cover object-center transition-all duration-300"
    />
    <div className="navigation absolute bottom-0 left-0 right-0 flex justify-between bg-black bg-opacity-50 p-2">
      <button
        className={`btn-ghosts btn btn-sm transform transition-all duration-300 hover:scale-110 ${
          selectedImageIndex === 0 ? "btn-disabled" : ""
        }`}
        onClick={selectedImageIndex === 0 ? undefined : onPrev}
      >
        <ChevronLeft className="inline-block h-5 w-5 stroke-current text-current" />
      </button>
      <div className="flex items-center justify-center space-x-2">
        {selectedImages.map((_, index) => (
          <span
            key={index}
            className={`inline-block h-2 w-2 rounded-full bg-current transition-all duration-300   ${
              selectedImageIndex === index
                ? "bg-primary bg-opacity-100"
                : "bg-opacity-50"
            }`}
          />
        ))}
      </div>
      <button
        className={`btn-ghosts btn btn-sm transform transition-all duration-300 hover:scale-110 ${
          selectedImageIndex === selectedImages.length - 1 ? "btn-disabled" : ""
        }`}
        onClick={
          selectedImageIndex === selectedImages.length - 1 ? undefined : onNext
        }
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
const UploadArea: React.FC<UploadAreaProps> = ({
  onDrop,
  isDragActive,
  selectedImages,
  style,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center rounded-lg font-sora ${
        isDragActive ? "bg-base-300" : "hover:bg-base-300"
      } h-full w-full cursor-pointer transition-all duration-300`}
      style={{ ...style, flex: 1 }}
    >
      <input {...getInputProps()} />
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-4">
        {selectedImages.map((image, index) => (
          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt="Selected"
            className="pointer-events-none h-16 w-16 rotate-12 transform cursor-none stroke-current transition-transform duration-300 hover:scale-110"
          />
        ))}
        <ImagePlus className="h-16 w-16 rotate-12 transform stroke-current transition-transform duration-300" />
        <p className="text-sm text-neutral opacity-70 transition-opacity duration-300 hover:opacity-100">
          Arrastra las fotos aquí
        </p>
        <div className="text-center">
          <input {...getInputProps()} />
          <button
            type="button"
            className="btn btn-primary no-animation btn-sm transform transition-all duration-300"
          >
            Seleccionar desde el dispositivo
          </button>
        </div>
      </div>
    </div>
  );
};

interface Profile {
  id: string;
  username: string;
  full_name: string;
  status: string;
  initials: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PostButtonProps {
  profile: Profile;
  categories: Category[];
  statusTypes: string[];
}
interface InformationFormProps {
  onSubmit: (data) => void;
  profile: Profile;
  categories: Category[];
  statusTypes: string[];
  selectedImages: File[];
}

const InformationForm: React.FC<InformationFormProps> = ({
  onSubmit,
  profile,
  categories,
  statusTypes,
  selectedImages,
}) => {
  // normal states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Seleccione");
  const [selectedStatus, setSelectedStatus] = useState("Seleccione");

  // errors states
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedCategory("Seleccione");
    setSelectedStatus("Seleccione");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setTitleError(false);
    setDescriptionError(false);
    setCategoryError(false);
    setStatusError(false);

    // Check if any of the fields are empty
    if (!title) {
      setTitleError(true);
      return;
    }
    if (!description) {
      setDescriptionError(true);
      return;
    }
    if (selectedCategory === "Seleccione") {
      setCategoryError(true);
      return;
    }
    if (selectedStatus === "Seleccione") {
      setStatusError(true);
      return;
    }

    if (selectedImages.length === 0) {
      console.error("No images selected");
      return;
    }

    onSubmit({
      id: profile.id,
      title: title,
      description: description,
      status: selectedStatus,
      category_id: Number(selectedCategory),
      images: selectedImages,
    });

    resetForm();
  };

  return (
    <>
      <div className="divider m-0 p-0" />
      <form onSubmit={handleSubmit} className="space-y-2 p-4">
        <div className="flex flex-row items-center gap-4">
          <div className="avatar placeholder">
            <div className="w-10 rounded-full bg-primary text-neutral-content">
              <span className="text-sm">{profile.initials}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold capitalize text-current">
              {profile.full_name}
            </span>
            <span className="text-xs font-semibold text-neutral">
              @{profile.username}
            </span>
          </div>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text space-x-2">
              <span className="text-sm">Titulo</span>
            </span>
            <span
              className="label-text-alt tooltip tooltip-left tooltip-primary max-w-xs cursor-help"
              data-tip="El titulo es la primera impresion que tendran los usuarios de tu publicacion."
            >
              <HelpCircle className="inline-block h-4 w-4 stroke-current" />
            </span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el nombre del objeto"
            className={`input input-bordered w-full transition-colors focus:input-primary ${
              titleError ? "input-error" : ""
            }`}
            onClick={() => setTitleError(false)}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              <span className="text-sm">Descripción</span>
            </span>
            <span
              className="label-text-alt tooltip tooltip-left tooltip-primary max-w-xs cursor-help"
              data-tip="Describe el objeto y su estado. También, indica lo que estás buscando a cambio."
            >
              <HelpCircle className="inline-block h-4 w-4 stroke-current" />
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cuentanos sobre el objeto"
            className={`textarea textarea-bordered w-full transition-colors focus:textarea-primary ${
              descriptionError ? "textarea-error" : ""
            }`}
            onClick={() => setDescriptionError(false)}
            maxLength={200}
            style={{ resize: "none" }}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-xs">Categoria del Objeto</span>
              <span
                className="tooltip tooltip-top tooltip-primary cursor-help"
                data-tip="La categoria nos ayuda a clasificar el objeto, para que sea mas facil de encontrar."
              >
                <HelpCircle className="inline-block h-4 w-4 stroke-current" />
              </span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`select select-bordered w-full transition-colors focus:select-primary ${
                categoryError ? "select-error" : ""
              }`}
              onClick={() => setCategoryError(false)}
            >
              <option disabled>Seleccione</option>
              {categories.map((category) => (
                <option
                  className="capitalize"
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-xs">Estado del objeto</span>
              <span
                className="tooltip tooltip-left tooltip-primary cursor-help"
                data-tip="
                                El estado del objeto es una forma de describir el estado en el que se encuentra el objeto,
                                si es nuevo, casi nuevo, usado o muy usado."
              >
                <HelpCircle className="inline-block h-4 w-4 stroke-current" />
              </span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`select select-bordered w-full transition-colors focus:select-primary ${
                statusError ? "select-error" : ""
              }`}
              onClick={() => setStatusError(false)}
            >
              <option disabled>Seleccione</option>
              {statusTypes.map((status: string, index: number) => (
                <option className="capitalize" key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          onClick={handleSubmit}
        >
          Publicar
        </button>
      </form>
    </>
  );
};

const PostButton: React.FC<PostButtonProps> = ({
  profile,
  categories,
  statusTypes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [postSlug, setPostSlug] = useState("");

  const resetModal = () => {
    setSelectedImages([]);
    setSelectedImageIndex(0);
    setStep(0);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    resetModal();
  };

  const handleCloseModal = () => {
    setTimeout(() => {
      setIsCompleted(false);
    }, 300);
    setIsModalOpen(false);
    resetModal();
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    const sbat = Cookies.get("sbat");

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== "images") {
        formData.append(key, data[key]);
      }
    });

    data.images.forEach((image: File, index: number) => {
      formData.append("images", image, `image-${index}`);
    });

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        Authorization: `${sbat}`,
      },
      body: formData,
    });

    if (response.ok) {
      const post = await response.json();
      setPostSlug(post);
      setIsCompleted(true);
    } else {
      console.error("Error al crear la publicación", response.statusText);
    }
    setIsLoading(false);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    setSelectedImages(
      acceptedFiles.slice(0, 10).map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
    setStep(1); // Move to the next step after images are uploaded
  };

  const handlePrev = () => setSelectedImageIndex((prevIndex) => prevIndex - 1);
  const handleNext = () => setSelectedImageIndex((prevIndex) => prevIndex + 1);
  const handleNextButton = () => setStep(2);
  const handleBack = () => setStep(step - 1);

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
        isCompleted={isCompleted}
        isLoading={isLoading}
        style={{
          maxHeight: "898px",
          maxWidth: "855px",
          minHeight: "391px",
          minWidth: "348px",
          width: "432px",
        }}
        className="modal-box flex flex-col rounded-md px-4 py-2 font-sora transition-all duration-300"
      >
        {step === 0 && (
          <UploadArea
            onDrop={handleDrop}
            isDragActive={false}
            selectedImages={selectedImages}
            style={{
              flex: 1,
              minHeight: "391px",
              minWidth: "348px",
              width: "432px",
            }}
          />
        )}
        {step === 1 && (
          <ImageContainer
            // @ts-ignore
            image={selectedImages[selectedImageIndex]?.preview}
            onPrev={handlePrev}
            onNext={handleNext}
            className="image-container cursor-none select-none"
            selectedImageIndex={selectedImageIndex}
            selectedImages={selectedImages}
            style={{
              maxHeight: "898px",
              maxWidth: "855px",
              minHeight: "391px",
              minWidth: "348px",
              width: "432px",
              height: "432px",
            }}
          >
            <img
              // @ts-ignore
              src={selectedImages[selectedImageIndex]?.preview}
              alt={`Selected ${selectedImageIndex + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="navigation">
              <button
                className="btn-ghosts btn btn-sm transform transition-all duration-300 hover:scale-110"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-5 w-5 stroke-current" />
              </button>
              <button
                className="btn-ghosts btn btn-sm transform transition-all duration-300 hover:scale-110"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5 stroke-current" />
              </button>
            </div>
          </ImageContainer>
        )}
        {step === 2 &&
          (isLoading ? (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="flex items-center justify-center">
                <DoubleSpinner />
              </div>
            </div>
          ) : isCompleted ? (
            <div className="m-4 flex h-full flex-grow items-center justify-center rounded-3xl bg-base-100">
              <div className="flex items-center justify-center">
                <CompletionAnimation slug={postSlug} />
              </div>
            </div>
          ) : (
            <InformationForm
              onSubmit={handleSubmit}
              categories={categories}
              profile={profile}
              statusTypes={statusTypes}
              selectedImages={selectedImages}
            />
          ))}
      </ImageModal>
    </div>
  );
};

export default PostButton;
