import React from 'react';

interface SocialReAuthenticationProps {
    provider: string;
    redirectPath: string;
}

export const SocialReAuthentication: React.FC<SocialReAuthenticationProps> = ({ provider, redirectPath }) => {
    const handleLogin = () => {
        // const redirectUri = encodeURIComponent(`${process.env.REACT_APP_API_URL}` + `/callback/${provider}`);
        // let authUrl = '';

        // if (provider === 'kakao') {
        //     authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY_KAKAO}&redirect_uri=${redirectUri}`;
        // } else if (provider === 'naver') {
        //     authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID_NAVER}&redirect_uri=${redirectUri}&state=YOUR_STATE_STRING`;
        // }
        let authUrl = `${process.env.REACT_APP_API_URL}` + `/authorize?type=${provider}&redirectPath=${redirectPath}`;
        window.location.href = authUrl;
    };

    return (
        <div>
            {provider === 'naver' && (
                <img src={process.env.PUBLIC_URL + `/login/naver_login_btnG_complete.png`} className='mb-1 h-[45px] w-full hover:cursor-pointer'
                alt="네이버 로그인 버튼" onClick={handleLogin}/>
            )}
            {provider === 'kakao' && (
                <img src={process.env.PUBLIC_URL + `/login/kakao_login_medium_wide.png`} className='hover:cursor-pointer'
                alt="카카오 로그인 버튼" onClick={handleLogin}/>
            )}
            {/* <button onClick={handleLogin}>
                {provider === 'kakao' ? '카카오 로그인' : '네이버 로그인'}
            </button> */}
        </div>
    );
};
