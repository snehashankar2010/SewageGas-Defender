import React from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
    let user = {};
    if (!user) {
        return (
            <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 md:py-4 md:px-10 md:text-lg"
            >
                Login to dashboard
            </Link>
        );
    }
    return (
        <Link
            to="/dashboard"
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 md:py-4 md:px-10 md:text-lg"
        >
            Goto dashboard
        </Link>
    );
};

const LandingPage = () => {
    return (
        <div className="">
            <main className="mx-auto max-w-7xl p-2 sm:px-4 md:px-8">
                {/* hero */}
                <div className="relative bg-white">
                    <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
                        <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                    Realtime Sewage Gas Monitoring and Control System
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                                    Remotely monitor temperature using Iot
                                    technology and get notified if temperature
                                    crosses a threshold.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="flex">
                                        <GetStarted />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        {/* <img
                            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
                            src={landingImg}
                            alt=""
                        /> */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
