import React from 'react';
import { Link } from 'react-router-dom';

import githubIcon from './github_icon.svg';
import discordIcon from './discord_icon.svg';

const footerLinks = [
    {
        name: 'Login',
        link: '/login',
    },
    {
        name: 'Signup',
        link: '/signup',
    },
];

const Footer = () => {
    return (
        <footer className="bg-slate-800 p-2 py-4 text-white sm:px-4 md:px-8">
            <div className="my-4 border-b border-slate-500"></div>
            <h3 className="mb-2 text-xl sm:text-2xl">Quick Links</h3>
            <ul className="grid gap-x-8 sm:grid-cols-2  md:flex">
                {footerLinks.map((link) => (
                    <li key={link.name}>
                        <Link
                            to={link.link}
                            className="underline decoration-white/90
                            hover:text-gray-300 sm:text-xl"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="my-4 flex items-center justify-center gap-3 sm:gap-6">
                {/* TODO: Add github source code link */}
                <a href="https://www.google.com" target="_blank">
                    <img
                        src={githubIcon}
                        className="w-6 sm:w-8"
                        alt="Source Code on GitHub"
                    />
                </a>
                <a href="https://discord.gg/FZY9TqW" target="_blank">
                    <img
                        src={discordIcon}
                        className="w-6 sm:w-8"
                        alt="Join the Discord Server"
                    />
                </a>
            </div>
            <h4 className="text-center sm:text-lg md:text-xl">
                <a
                    href="https://delano-lourenco.web.app"
                    target="_blank"
                    className="underline decoration-white/90 hover:text-gray-300"
                >
                    Delano Lourenco
                </a>{' '}
                &copy; {new Date().getFullYear()}
            </h4>
        </footer>
    );
};

export default Footer;
