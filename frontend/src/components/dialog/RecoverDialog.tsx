import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function RecoverDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[80%] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Recover Your Vault
                </Dialog.Title>

                <div className="mt-2">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Your email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example@devault.io"
                      className="input w-full max-w-xs input-sm"
                    />
                    <label className="label mt-2">
                      <span className="label-text">Master Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      className="input w-full max-w-xs input-sm"
                    />
                    <label className="label mt-2">
                      <span className="label-text">Secret Key</span>
                    </label>

                    <input
                      type="password"
                      placeholder="Password"
                      className="input w-full max-w-xs input-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
