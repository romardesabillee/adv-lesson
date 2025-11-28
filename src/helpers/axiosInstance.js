import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '',
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;