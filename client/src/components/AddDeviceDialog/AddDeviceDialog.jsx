import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useContext } from 'react';
import axios from '../../config/axios';
import UserContext from '../../contexts/UserContext';

const defaultAddDeviceValues = {
    name: '',
    location: '',
    description: '',
    temperature_threshold: 0,
};

const AddDeviceDialog = ({ isOpen, setIsOpen, setShowSuccesDialog }) => {
    const { user, setUser } = useContext(UserContext);

    const [addDeviceValues, setAddDeviceValues] = useState(
        defaultAddDeviceValues
    );
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
            .post('/device', {
                name: addDeviceValues.name,
                location: addDeviceValues.location,
                description: addDeviceValues.description,
                threshold: addDeviceValues.temperature_threshold,
            })
            .then((response) => {
                setLoading(false);
                setAddDeviceValues(defaultAddDeviceValues);

                closeModal();
                setShowSuccesDialog(true);

                setUser({
                    ...user,
                    devices: [...user.devices, response.device],
                });
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
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    <span>Add a new Device</span>
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

                            <div className="mt-2 h-2 w-full border-t-2 border-gray-100" />

                            <form method="POST" onSubmit={formSubmit}>
                                <div className="mt-2">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            autoComplete="devicename"
                                            className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                            minLength={3}
                                            maxLength={50}
                                            onInput={(e) =>
                                                setAddDeviceValues({
                                                    ...addDeviceValues,
                                                    name: e.target.value,
                                                })
                                            }
                                            value={addDeviceValues.name}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="location"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            maxLength={64}
                                            autoComplete="location"
                                            className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                            onInput={(e) =>
                                                setAddDeviceValues({
                                                    ...addDeviceValues,
                                                    location: e.target.value,
                                                })
                                            }
                                            value={addDeviceValues.location}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            type="text"
                                            name="description"
                                            required
                                            maxLength={160}
                                            autoComplete="description"
                                            className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                            onInput={(e) =>
                                                setAddDeviceValues({
                                                    ...addDeviceValues,
                                                    description: e.target.value,
                                                })
                                            }
                                            value={addDeviceValues.description}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="temperature_threshold"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Temperature Threshold (in Celcius)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            name="temperature_threshold"
                                            required
                                            className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                            onInput={(e) =>
                                                setAddDeviceValues({
                                                    ...addDeviceValues,
                                                    temperature_threshold:
                                                        e.target.value,
                                                })
                                            }
                                            value={
                                                addDeviceValues.temperature_threshold
                                            }
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="mt-2 text-xs uppercase text-red-600">
                                        {error.split('"').join('')}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:bg-gray-200"
                                    >
                                        {loading ? 'Loading' : 'Add'}
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

export default AddDeviceDialog;
