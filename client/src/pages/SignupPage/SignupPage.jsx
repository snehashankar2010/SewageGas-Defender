import React, { useReducer, useContext, useEffect } from 'react';
import axios from '../../config/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';

function signupReducer(state, action) {
    switch (action.type) {
        case 'field':
            return {
                ...state,
                [action.name]: action.value,
            };
        case 'signup':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'signupSuccess':
            return {
                ...state,
                loading: false,
                error: null,
            };
        case 'signupFail':
            return {
                ...state,
                loading: false,
                password: '',
                error: action.error,
            };
        default:
            return state;
    }
}

const SignupPage = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: '/dashboard' } };

    const [state, dispatch] = useReducer(signupReducer, {
        email: '',
        password: '',
        fullname: '',
        phone: '',
        loading: false,
        error: '',
    });

    const formSubmit = (e) => {
        e.preventDefault();

        dispatch({ type: 'signup' });
        axios
            .post('/auth/signup', {
                email: state.email,
                password: state.password,
                fullname: state.fullname,
                phone: state.phone,
            })
            .then((response) => {
                dispatch({ type: 'signupSuccess' });
                setUser({
                    ...response.user,
                    token: response.token,
                });
                localStorage.setItem('token', response.token);
                navigate(from, { replace: true });
            })
            .catch((err) => {
                dispatch({ type: 'signupFail', error: err.message });
            });
    };

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, []);

    return (
        <div className="flex-grow">
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Signup
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <form method="POST" onSubmit={formSubmit}>
                            <div className="overflow-hidden shadow shadow-green-400 sm:rounded-md">
                                <div className="bg-white px-4 pt-5 sm:px-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="fullname"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Full name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                id="fullname"
                                                autoComplete="full-name"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                                placeholder="Full name"
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'field',
                                                        name: 'fullname',
                                                        value: e.target.value,
                                                    })
                                                }
                                                required
                                                value={state.fullname}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Phone number
                                            </label>
                                            <input
                                                type="tel"
                                                pattern="[1-9][0-9]{9}"
                                                name="phone"
                                                id="phone"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                                                placeholder="10 digit Indian phone number"
                                                required
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'field',
                                                        name: 'phone',
                                                        value: e.target.value,
                                                    })
                                                }
                                                value={state.phone}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="email-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                type="text"
                                                name="email-address"
                                                id="email-address"
                                                autoComplete="email"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                                placeholder="Email address"
                                                required
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'field',
                                                        name: 'email',
                                                        value: e.target.value,
                                                    })
                                                }
                                                value={state.email}
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                                placeholder="Password"
                                                required
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'field',
                                                        name: 'password',
                                                        value: e.target.value,
                                                    })
                                                }
                                                value={state.password}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="group relative mt-6 mb-2 flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                                focus:ring-offset-2 disabled:bg-green-900 disabled:text-gray-200"
                                        disabled={state.loading}
                                    >
                                        {state.loading
                                            ? 'Loading...'
                                            : 'Signup'}
                                    </button>
                                </div>

                                {state.error && (
                                    <div className="px-4 py-3 text-sm uppercase text-red-600 sm:px-6">
                                        {state.error.split('"').join('')}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
