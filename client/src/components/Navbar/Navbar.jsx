import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';

const navLinks = [
    {
        name: 'Dashboard',
        link: '/dashboard',
    },
];

const NavLinkDesktop = ({ link }) => {
    return (
        <Link to={link.link} className="group block py-1">
            <span className="relative">
                {link.name}
                <div className="absolute bottom-0 h-0.5 w-full scale-0 bg-white transition duration-[200ms] ease-in-out group-hover:scale-100" />
            </span>
        </Link>
    );
};

const NavLinkMobile = ({ link }) => {
    return (
        <Link to={link.link} className="group block py-1">
            <span className="relative">
                {link.name}
                <div className="absolute bottom-0 h-0.5 w-full scale-0 bg-white transition duration-[200ms] ease-in-out group-hover:scale-100" />
            </span>
        </Link>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
        setUser(null);
    };
    useEffect(() => {
        const onWindowResize = () => {
            if (window.innerWidth >= 670) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', onWindowResize);

        return () => window.removeEventListener('resize', onWindowResize);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav
            aria-label="Main Navigation"
            className="relative flex-shrink-0 bg-green-600 p-2 px-4 text-white"
        >
            <div className="flex w-full items-center justify-between">
                <Link
                    to="/"
                    className="mr-8 flex-shrink-0 font-bold tracking-wider"
                >
                    Temperature Iot
                </Link>
                {/* Desktop nav */}
                <ul className="navsm:flex navsm:items-center hidden w-full justify-end gap-4">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLinkDesktop link={link} />
                        </li>
                    ))}
                    {user ? (
                        <li key="Logout">
                            <button
                                onClick={logout}
                                className="block rounded-3xl border-2 border-white py-1 hover:bg-white/90 hover:text-green-600"
                            >
                                <span className="px-3">Logout</span>
                            </button>
                        </li>
                    ) : (
                        <>
                            <li key="Login">
                                <Link
                                    to="/login"
                                    className="ml-4 block rounded-3xl bg-white py-1 hover:bg-white/90"
                                >
                                    <span className="px-3 text-green-600">
                                        Login
                                    </span>
                                </Link>
                            </li>

                            <li key="Signup">
                                <Link
                                    to="/signup"
                                    className="block rounded-3xl border-2 border-white py-1 hover:bg-white/90 hover:text-green-600"
                                >
                                    <span className="px-3">Signup</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                <button
                    className="navsm:hidden h-6 w-6 cursor-pointer"
                    onClick={toggleMenu}
                >
                    <div className="relative flex w-6 items-center justify-center">
                        <span
                            className={`absolute h-px w-full transform bg-current transition ${
                                isOpen
                                    ? 'translate-y-0 rotate-45'
                                    : '-translate-y-2 '
                            }`}
                        ></span>

                        <span
                            className={`absolute h-px w-full transform bg-current transition ${
                                isOpen
                                    ? 'translate-x-3 opacity-0'
                                    : 'opacity-100'
                            }`}
                        ></span>

                        <span
                            className={`absolute h-px w-full transform bg-current transition ${
                                isOpen
                                    ? 'translate-y-0 -rotate-45'
                                    : 'translate-y-2'
                            }`}
                        ></span>
                    </div>
                </button>
            </div>
            <div
                className={`transition-max-h w-full overflow-hidden duration-[400ms] ease-in-out ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                }`}
            >
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLinkMobile link={link} />
                        </li>
                    ))}
                    {user ? (
                        <li key="Logout">
                            <button
                                onClick={logout}
                                className="group block py-1"
                            >
                                <span className="relative">
                                    Logout
                                    <div className="absolute bottom-0 h-0.5 w-full scale-0 bg-white transition duration-[200ms] ease-in-out group-hover:scale-100" />
                                </span>
                            </button>
                        </li>
                    ) : (
                        <>
                            <li key="Login">
                                <NavLinkMobile
                                    link={{ name: 'Login', link: '/login' }}
                                />
                            </li>
                            <li key="Signup">
                                <NavLinkMobile
                                    link={{ name: 'Signup', link: '/signup' }}
                                />
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
