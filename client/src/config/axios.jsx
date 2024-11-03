import axios from 'axios';

if (import.meta.env.MODE != 'development') {
    console.log('Is prod.');
} else {
    console.log('Is dev.');
}

const instance = axios.create({
    baseURL:
        import.meta.env.MODE != 'development'
            ? 'https://temperature-iot-project.herokuapp.com/api'
            : 'http://localhost:5000/api/',
    timeout: 2000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
});

// instance.interceptors.request.use(
//     function (config) {
//         // Do something before request is sent
//         return config;
//     },
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error);
//     }
// );

instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        if (error.code == 'ECONNABORTED') {
            // Timeout
            return Promise.reject(new Error("Couldn't connect to server"));
        }

        if (error.response && error.response.data) {
            let response = error.response.data;
            if (response.code) {
                if (response.code == 404) {
                    return Promise.reject(new Error('404 Not found'));
                }
            }
            return Promise.reject(new Error(response.message));
        }
        return Promise.reject(error);
    }
);

export default instance;
