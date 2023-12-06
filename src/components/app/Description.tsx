import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const Description = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative pb-4">
      <div
        className="tooltip tooltip-bottom tooltip-primary h-full w-full"
        data-tip="Ver más información"
      >
        <p
          className="line-clamp-[10] h-full cursor-pointer whitespace-pre-line text-left font-normal text-current"
          onClick={toggleModal}
        >
          {text}
        </p>
      </div>
      <Dialog
        open={isOpen}
        onClose={toggleModal}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Dialog.Overlay className="fixed inset-0 bg-base-100 bg-opacity-75 transition-opacity" />
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Dialog.Description
            as="div"
            className="inline-block transform overflow-hidden rounded-lg bg-base-200 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          >
            <div className="bg-base-200 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-current brightness-200"
                  >
                    Descripción
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="whitespace-pre-line text-sm text-current">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-base-200 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="btn btn-primary mt-3 inline-flex w-full justify-center focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={toggleModal}
              >
                Cerrar
              </button>
            </div>
          </Dialog.Description>
        </div>
      </Dialog>
    </div>
  );
};

export default Description;
