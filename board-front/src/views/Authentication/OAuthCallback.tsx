import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import axios from 'axios';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const OAuthCallback = () => { 
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const redirectPath = url.searchParams.get("redirectPath");
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [userMatch, setUserMath] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const url = '/social/match';
        const method = 'POST';
        const data = {
            token: token
        };

        const fetchData = async () => {
            try {
                const response = await sendRequestWithToken(url, method, data, setIsLoggedIn);
                console.log(response);
                console.log(redirectPath);
                navigate('/myPage', {
                    state: {
                        page: redirectPath,
                        isSocialAuthenticated: response,
                        token: token,
                    }
                });
            } catch (error: any) {
                setIsLoggedIn(false);
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, [])
    return (
        <div>{userMatch}</div>
    )
}
