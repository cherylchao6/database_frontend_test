"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  title: string;
  content: React.ReactNode;
  confirmLabel?: string;
  confirmAction?: () => void;
  cancelAction?: () => void;
  cancelLabel?: string;
  showCheckIcon?: boolean;
  displayConfirmLabel?: boolean;
  displayCancelLabel?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  content,
  confirmLabel = "Confirm",
  confirmAction,
  cancelLabel = "Cancel",
  cancelAction,
  showCheckIcon = false,
  displayConfirmLabel = true,
  displayCancelLabel = true,
}: ModalProps) {
  const buttonCount =
    (displayConfirmLabel ? 1 : 0) + (displayCancelLabel ? 1 : 0);
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose(false);
      }}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              {showCheckIcon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
              )}
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  {content} {/* Render any JSX passed as the content */}
                </div>
              </div>
            </div>
            <div
              className={`mt-5 sm:mt-6 ${
                buttonCount === 1
                  ? "flex justify-center w-1/5 mx-auto"
                  : "sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              }`}
            >
              {/* Conditionally render confirm button */}
              {displayConfirmLabel && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirmAction) {
                      confirmAction(); // Perform the confirm action
                    }
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                >
                  {confirmLabel}
                </button>
              )}
              {/* Conditionally render cancel button */}
              {displayCancelLabel && (
                <button
                  type="button"
                  onClick={() => {
                    if (cancelAction) {
                      cancelAction(); // Perform the cancel action
                    }
                    onClose(false);
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  {cancelLabel}
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
