import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import RecentProducts from '../components/SideBar/RecentProducts'
import styles from './SideBar.module.css'
import { KakaoSideBar } from 'components/SideBar/KakaoSideBar';

export const SideBar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const navbarHeight = 200; // Navbar의 높이를 변수로 지정, 실제 높이에 맞게 조정 필요
            const shouldBeSticky = window.scrollY > navbarHeight;
            setIsSticky(shouldBeSticky);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

      // 현재 라우트에 따라 다른 스타일 객체를 생성
    const getStyleBasedOnRoute = () => {
        switch(location.pathname) {
            case '/':
                return { top: '700px', right: '3%'};
            case '/order':
                return { top: '300px', left: '3%'};
            // 기타 라우트별 스타일 설정
            default:
                return { top: '300px', right: '3%'};
        }
    }
        
    return (
        <div 
            className={styles.sideBarContainer} 
            style={{
                ...getStyleBasedOnRoute(),
                ...(isSticky ? { position: 'fixed', top: '200px' } : {})
            }}
        >

            <div className={styles.sideBar1}> <RecentProducts /> </div>
            <div className={styles.sideBar2}> <KakaoSideBar /> </div>
        </div>
    )
}
