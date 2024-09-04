import { FaChevronLeft } from 'react-icons/fa';


const CustomPrevArrowComp: React.FC= ({ onClick } : any) => {
    return (
        <div className="slick-arrow slick-prev" onClick={onClick}>
            <FaChevronLeft size={30} color="black"/>
        </div>
    );
};

export default CustomPrevArrowComp;