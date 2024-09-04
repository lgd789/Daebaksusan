import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function OAuthToken() {

    const { token } = useParams();
    const navigate = useNavigate();


  return (
    <>{token}</>
  )
}
