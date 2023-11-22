import { MapPin } from 'lucide-react';
import { Fragment, useState, } from 'react';
import { Transition, Dialog } from '@headlessui/react';


export function LocationButton() {
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

export default LocationButton;