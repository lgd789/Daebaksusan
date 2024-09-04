import { FaChevronRight } from "react-icons/fa";



const CustomNextArrowComp: React.FC = ({ onClick} : any) => {
    return (
        <div className="slick-arrow slick-next" onClick={onClick} >
            <FaChevronRight size={30} color="black"/>
        </div>
    );
};

export default CustomNextArrowComp;