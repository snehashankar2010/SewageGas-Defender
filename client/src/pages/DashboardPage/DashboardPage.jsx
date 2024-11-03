import React, { useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';

import { Link } from 'react-router-dom';
import AddDeviceDialog from './../../components/AddDeviceDialog/AddDeviceDialog';
import CustomDialog from './../../components/CustomDialog/CustomDialog';
import DeleteAccountConfirmDialog from './../../components/DeleteAccountConfirmDialog/DeleteAccountConfirmDialog';

const DashboardPage = () => {
    const { user, _ } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showSuccesDialog, setShowSuccesDialog] = useState(false);
    const [showDeleteAccountConfirmDialog, setShowDeleteAccountConfirmDialog] =
        useState(false);
    return (
        <div className="flex flex-grow flex-col items-center">
            <DeleteAccountConfirmDialog
                isOpen={showDeleteAccountConfirmDialog}
                setIsOpen={setShowDeleteAccountConfirmDialog}
            />
            <main className="w-full max-w-7xl flex-grow p-2 pt-4">
                <div className="relative flex-grow items-start justify-start space-x-2 px-5 py-5 md:flex md:flex-row">
                    <main className="mt-4 w-full space-y-4 md:mt-0 md:flex-grow">
                        <div className="overflow-hidden rounded-lg bg-gradient-to-l from-green-200 via-white to-white shadow">
                            <div className="flex items-center justify-between px-4 py-5 sm:p-6">
                                <h1 className="text-4xl font-bold">
                                    Hello, {user.fullname}.
                                </h1>
                            </div>
                        </div>

                        <section className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                            <div className="flex-1 flex-shrink-0 space-y-4">
                                <div className="flex flex-col bg-white p-6 shadow lg:flex-row lg:space-y-2 lg:space-x-4">
                                    <div className="flex w-full flex-col">
                                        <div className="flex justify-between">
                                            <h2 className="text-2xl font-semibold">
                                                Your Devices
                                            </h2>
                                            <button
                                                className="h-8 w-32 rounded border border-transparent bg-green-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                onClick={() => setIsOpen(true)}
                                            >
                                                Add Device
                                            </button>
                                            <AddDeviceDialog
                                                isOpen={isOpen}
                                                setIsOpen={setIsOpen}
                                                setShowSuccesDialog={
                                                    setShowSuccesDialog
                                                }
                                            />
                                            {/* Add Device Success Dialog */}
                                            <CustomDialog
                                                isOpen={showSuccesDialog}
                                                setIsOpen={setShowSuccesDialog}
                                                title="Add Device Success"
                                                description="The device was added successfully."
                                                type="success"
                                            />
                                        </div>

                                        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                            {user.devices.length == 0 && (
                                                <p>
                                                    No devices. To add one click
                                                    Add Device.
                                                </p>
                                            )}
                                            {user.devices.map(
                                                (device, index) => {
                                                    return (
                                                        <Link
                                                            to={`/device/${device._id}`}
                                                            key={index}
                                                        >
                                                            <div className="flex h-full flex-col flex-wrap border-2 border-gray-100 p-2 px-4 shadow-lg hover:border-green-200 hover:shadow">
                                                                <h3 className="font-semibold">
                                                                    {
                                                                        device.name
                                                                    }
                                                                </h3>
                                                                <p className="max-w-full flex-grow text-gray-600">
                                                                    {
                                                                        device.description
                                                                    }
                                                                </p>

                                                                <p className="mt-3 flex flex-wrap items-center text-sm text-gray-400">
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
                                                                            d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                                                                        />
                                                                    </svg>
                                                                    {
                                                                        device.location
                                                                    }
                                                                </p>

                                                                <p className="mt-2 flex items-center space-x-2 text-green-600 hover:underline">
                                                                    View
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                            <div className="flex-1 flex-shrink-0 space-y-4">
                                <div className="flex flex-col bg-white p-6 shadow lg:flex-row lg:space-y-2 lg:space-x-4">
                                    <div className="flex w-full flex-col">
                                        <div className="flex justify-between">
                                            <h2 className="text-2xl font-semibold">
                                                Your Profile
                                            </h2>
                                        </div>

                                        <div className="mt-4 gap-8">
                                            <div className="flex flex-wrap gap-3">
                                                <h3 className="font-semibold">
                                                    Phone:
                                                </h3>
                                                <p>
                                                    +91{' '}
                                                    {user.phone.replace(
                                                        user.phone.substring(
                                                            2,
                                                            8
                                                        ),
                                                        'xxxxxx'
                                                    )}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-3">
                                                <button
                                                    className="h-8 rounded border border-transparent bg-red-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    onClick={() =>
                                                        setShowDeleteAccountConfirmDialog(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
