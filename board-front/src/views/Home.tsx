import React from 'react';

import CarouselComp from 'components/CarouselComp';
import { BestProduct } from 'components/BestProduct';
import { HomeBanner1 } from 'components/HomeBanner/HomeBanner1';
import { useAnimateOnScroll } from 'hook/useAnimateOnScroll '
import './Home.css'
import { HomeBanner2 } from 'components/HomeBanner/HomeBanner2';
import TimeLimitedDeals from 'components/Deals/TimeLimitedDeals';
import { AdBanner } from 'components/HomeBanner/AdBanner';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';

export const Home: React.FC = () => {
  const ref1 = useAnimateOnScroll();
  const ref2 = useAnimateOnScroll();
  const ref3 = useAnimateOnScroll();
  const ref4 = useAnimateOnScroll();
  const ref5 = useAnimateOnScroll();
  const ref6 = useAnimateOnScroll();
  const ref7 = useAnimateOnScroll();
  const ref8 = useAnimateOnScroll();


  return (
    <>
      <div className='carouselContainer'>
        <CarouselComp />
      </div>
      <div className='homeContainer'>
        <div ref={ref1}>
          <TimeLimitedDeals />
        </div>

        <div ref={ref2}>
          <HomeBanner2 />
        </div>

        <div ref={ref3}>
          <BestProduct category='best' />
        </div>

        <div ref={ref4} className="HomeBanner">
          <AdBanner imageUrl={process.env.PUBLIC_URL + `/banner/kakao_plus.jpg`} title="대박수산 카카오톡 친구 추가" />
        </div>

        <div ref={ref5}>
          <BestProduct category='new' />
        </div>

        <div ref={ref6} className="HomeBanner">
          <VideoPlayer />
        </div>

        <div ref={ref7}>
          <BestProduct category='all' />
        </div>

        <div ref={ref8} className="HomeBanner">
          <AdBanner imageUrl={process.env.PUBLIC_URL + `/banner/review_event3.jpg`} title="리뷰 이벤트" />
        </div>
      </div>
    </>
  );
};
