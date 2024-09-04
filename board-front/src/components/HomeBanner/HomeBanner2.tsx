import React, { useEffect, useState } from 'react';
import { RcmndProductComp } from 'components/product/RcmndProductComp';
import axios, { AxiosResponse } from 'axios';
import { Product } from 'types';
import ImageGalleryComp from 'components/ImageGallery/ImageGalleryComp';
import { Link } from 'react-router-dom';

export const HomeBanner2 = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<Product[]> = await axios.get<Product[]>(`${process.env.REACT_APP_API_URL}/product/recommend`);
        console.log(response);
        setProducts(response.data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-full my-20 p-3'>
      <Link to={"recommend"} className='text-2xl font-bold md:text-4xl no-underline text-black dark:text-white'>✨ 이달의 추천 상품 ✨</Link>
      <ImageGalleryComp items={products} fontSize='8px' component={RcmndProductComp} rows={2} />
    </div>
  );
};
