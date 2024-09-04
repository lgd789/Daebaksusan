
import icon from 'assets/kakaoLogo.png';
import styles from './KakaoSideBar.module.css';

export const KakaoSideBar = () => {
  const handleClick = () => {

    window.open('https://www.kakaocorp.com/page/service/service/KakaoTalk', '_blank');
  };

  return (
    <img src={icon} className={styles.kakaoSideBarImg} onClick={handleClick} alt="카카오 사이드바 로고"/>
  );
};
