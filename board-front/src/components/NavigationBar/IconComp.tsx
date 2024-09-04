import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface IconProps {
    defaultIcon: string;
    hoverIcon: string;
    title: string;
    link: string; 
    size?: number;
}

const IconComp: React.FC<IconProps> = ({ defaultIcon, hoverIcon, title, link, size=50 }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    return (
        <div className="m-2" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <Link to={link} state={{ category: null }} className="flex">
                {isHovered ? (
                    <div className="flex scale-110">
                        <img src={hoverIcon} alt={`${title} Hovered Image`} style={{ width: size, height: size}} />
                        <span className="m-1 content-center text-blue-700 hidden xl:block"> {title} </span>
                    </div>
                ) : (
                    <>
                        <img src={defaultIcon} alt={title} style={{ width: size, height: size }} />
                        <span className="m-1 content-center hidden xl:block"> {title} </span>
                    </>
                    
                )}
            </Link>
        </div>
    );
};

export default IconComp;
