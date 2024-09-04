import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function OAuth() {

    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(()=>{

        if (!token) return;
        
        const tokens = token.split('&');
        console.log(tokens);
        localStorage.setItem('accessToken', tokens[0])
        localStorage.setItem('refreshToken', tokens[1])
        navigate('/');
    }, [token]);

  return (
    <></>
  )
}
