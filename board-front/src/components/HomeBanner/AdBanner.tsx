import React, { useState } from 'react';

interface AdBannerProps {
    imageUrl: string;
    title: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ imageUrl, title }) => {


    return (
        <img src={imageUrl} alt="대박수산" title={title} className="rounded-lg"/>
    );
};
