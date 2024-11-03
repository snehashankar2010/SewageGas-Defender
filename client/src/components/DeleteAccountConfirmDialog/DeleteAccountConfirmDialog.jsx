import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useContext } from 'react';
import axios from '../../config/axios';
import UserContext from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccountConfirmDialog = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(false);
            setError(null);
        }
    }, [isOpen]);

    const closeModal = () => {
        setIsOpen(false);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        axios
            .delete('/auth')
            .then(() => {
                setLoading(false);
                setUser(null);
                localStorage.removeItem('token');
                closeModal();
                navigate('/', { replace: true });
                return;
            })
            .catch((err) => {
                setLoading(false);
                setError(err.message);
            });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle transition-all">
                            <div className="flex justify-between">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-red-600"
                                >
                                    <span>Confirm Delete Account</span>
                                </Dialog.Title>
                                <button
                                    className="text-gray-400 hover:text-gray-800"
                                    onClick={closeModal}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18 18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-2 h-2 w-full border-t-2 border-red-300" />

                            <form method="POST" onSubmit={formSubmit}>
                                <span className="text-gray-500">
                                    Are you sure you want to delete your account
                                    and all your devices?
                                </span>
                                {error && (
                                    <div className="mt-2 text-xs uppercase text-red-600">
                                        {error.split('"').join('')}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-200"
                                    >
                                        {loading ? 'Loading' : 'Delete'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeleteAccountConfirmDialog;
