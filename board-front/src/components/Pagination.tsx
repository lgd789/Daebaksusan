import React from 'react';
import paginationLeftArrow from '../assets/paginationLeftArrow.png'
import paginationRightArrow from '../assets/paginationRightArrow.png'
import paginationDoubleLeftArrow from '../assets/paginationDoubleLeftArrow.png'
import paginationDoubleRightArrow from '../assets/paginationDoubleRightArrow.png'



interface PaginationProps {
    pageSize: number
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pageSize, totalPages, currentPage, onPageChange }) => {
    const pages: number[] = [];

     // 시작 페이지와 끝 페이지 계산
     let startPage = Math.max(1, currentPage - Math.floor(pageSize / 2));
     let endPage = Math.min(totalPages, startPage + pageSize - 1);
 
     // 시작 페이지를 다시 계산하여 보여줄 페이지 수를 유지
     startPage = Math.max(1, endPage - pageSize + 1);
 
     // 페이지 번호 계산
     for (let i = startPage; i <= endPage; i++) {
         pages.push(i);
     }
 

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center mt-4">
            <nav>
                <ul className="flex">
                    {/* First button */}
                    <li className={`flex justify-center border-1 w-6 h-full rounded-l ${currentPage === 1 ? 'border-gray-400 bg-gray-400' : 'text-blue-700 hover:cursor-pointer'}`}>
                        <img className="" src={paginationDoubleLeftArrow} onClick={() => goToPage(1)} />
                    </li>

                    {/* Previous button */}
                    <li className={`flex justify-center border-1 w-6 h-full  ${currentPage === 1 ? 'border-gray-400 bg-gray-400' : 'text-blue-700 hover:cursor-pointer'}`}>
                        <img className="" src={paginationLeftArrow} onClick={() => goToPage(currentPage-1)} />
                    </li>

                    {/* Page numbers */}
                    {pages.map((page) => (
                        <li key={page} className={`border-1 w-6 h-full ${page === currentPage ? "border-blue-700 bg-blue-700 text-white" : 'text-blue-700'}`}>
                            <button className=" " onClick={() => goToPage(page)}>
                                {page}
                            </button>
                        </li>
                    ))}

                    {/* Next button */}
                    <li className={`flex justify-center border-1 w-6 h-full ${currentPage === totalPages ? 'border-gray-400 bg-gray-400' : 'text-blue-700 hover:cursor-pointer'}`}>
                        <img className="" src={paginationRightArrow} onClick={() => goToPage(currentPage+1)} />
                    </li>

                    {/* Last button */}
                    <li className={`flex justify-center border-1 w-6 h-full rounded-r ${currentPage === totalPages ? 'border-gray-400 bg-gray-400' : 'text-blue-700 hover:cursor-pointer'}`}>
                        <img className="" src={paginationDoubleRightArrow} onClick={() => goToPage(totalPages)} />
                    </li>
                </ul>
            </nav>
        </div>
    );
};
