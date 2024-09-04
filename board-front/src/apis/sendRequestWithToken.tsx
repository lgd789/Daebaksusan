import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
});

export async function refreshAccessToken() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('refreshToken 없음')
        } 
        
        const response = await instance.post(
            '/refreshToken',
            { refreshToken },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        localStorage.setItem('accessToken', response.data.accessToken);
        console.log('새로운 액세스토큰 발급')
        // 새로운 액세스 토큰이 response.data에 있는지 확인하고 반환
        return response.data.accessToken;
    } catch (error) {
        throw new Error('새로운 액세스 토큰 요청 실패');
    }
}

export async function sendRequestWithToken(url: string, method: string, data: any, setIsLoggedIn: any) {
    const contentType = data instanceof FormData ? 'multipart/form-data' : 'application/json';
    
    try {
        const token = localStorage.getItem('accessToken');
        
        const config: AxiosRequestConfig = {
            method,
            url,
            data,
            headers: {
                'Content-Type': contentType,
                Authorization: `Bearer ${token}`
            }
        };

        const response = await instance(config);
        setIsLoggedIn(true);
        return response.data;

    } catch (error: unknown) {

        const axiosError = error as AxiosError;
        if (!axiosError.response || axiosError.response.status === 403) {

            try {
                const newAccessToken = await refreshAccessToken();

                // 새로운 액세스 토큰을 localStorage에 저장한 후에 요청을 다시 보냄
                const newTokenConfig: AxiosRequestConfig = {
                    method,
                    url,
                    data,
                    headers: {
                        'Content-Type': contentType,
                        Authorization: `Bearer ${newAccessToken}`
                    }
                };


                const newTokenResponse = await instance(newTokenConfig);

                console.log("새로운 액세스 토큰 생성");
                setIsLoggedIn(true)
                return newTokenResponse.data;
            } catch (refreshError) {
                const axiosError = refreshError as AxiosError;
                if (!axiosError.response || axiosError.response.status === 403) {

                    setIsLoggedIn(false)
                    console.error('새로운 액세스 토큰 요청 실패:', refreshError);
                    throw refreshError
                }
                else {
                    throw axiosError
                }
            }

        }
        else {
            throw axiosError;
        }
    }
}
