import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import logo from '../assets/logo_sample.png'
import styles from './NavigationBar.module.css'
import cartIcon from '../assets/cart.png'
import loginIcon from '../assets/login.png'
import newIcon from '../assets/newIcon.png'
import bestIcon from '../assets/bestIcon.png'
import allIcon from '../assets/allIcon.png'
import menuIcon from '../assets/tabBar.png'
import homeICon from '../assets/homeIcon.png'

import newBlueIcon from '../assets/newBlueIcon.png'
import bestBlueIcon from '../assets/bestBlueIcon.png'
import allBlueIcon from '../assets/allBlueIcon.png'
import cartBlueIcon from '../assets/cartBlue.png'
import loginBlueIcon from '../assets/loginBlue.png'



import searchIcon from '../assets/search.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Category } from 'types';
import useDebounce from 'hook/useDebounce'
import { useAuthContext } from 'hook/AuthProvider'
import IconComp from 'components/NavigationBar/IconComp'

type SearchResults = Array<any>

export const NavigationBar = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<HTMLUListElement>(null);
    const inputMobileRef = useRef<HTMLInputElement>(null);
    const searchResultsMobileRef = useRef<HTMLUListElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
    const [prevScrollY, setPrevScrollY] = useState<number>(0);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResults>([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const debouncedQuery = useDebounce<string>(query, 300);
    const navigate = useNavigate();
    const location = useLocation();
    // const [cartItems, setCartItems] = useState<Cart[]>([]);


    useEffect(() => {
        setIsMenuOpen(false);
        toggleSearch(false);
    }, [location]);


    useEffect(() => {
        // API 호출
        fetch(`${process.env.REACT_APP_API_URL}/categories`)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);


    useEffect(() => {
        console.log('로그인 상태가 변경되었습니다:', isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsNavVisible(currentScrollY <= prevScrollY || currentScrollY === 0);
            setPrevScrollY(currentScrollY);
            setIsMenuOpen(false);
            setSearchResults([]);
            setIsSearchOpen(false);
           
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollY]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedQuery) {
                setSearchResults([]);
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/product/search/sub?query=${debouncedQuery}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                const data = await response.json();
                setSelectedItemIndex(null);
                setSearchResults(data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResults([]);
            }
        };
        fetchSearchResults();
        console.log(`API를 호출하여 검색 결과를 업데이트: ${debouncedQuery}`);
    }, [debouncedQuery]);

    const handleSearchItemClick = useCallback((index: number) => {
        setSelectedItemIndex(index);
        setQuery(searchResults[index].name);
        if (inputRef.current) {
            inputRef.current.focus(); // 포커스 설정
        }
        if (inputMobileRef.current) {
            inputMobileRef.current.focus(); // 포커스 설정
        }

    }, [searchResults]);

    const handleSearch = () => {
        if (debouncedQuery === '') {
            return
        }

        navigate(`/product/search/${debouncedQuery}`);

        setQuery('');
        setSearchResults([]);
    }

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedItemIndex(prevIndex => (prevIndex === null ? 0 : Math.min(prevIndex + 1, searchResults.length - 1)));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedItemIndex(prevIndex => (prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)));
        } else if (event.key === 'Enter' && selectedItemIndex !== null) {
            event.preventDefault();
            handleSearchItemClick(selectedItemIndex);
        }
    }, [searchResults, selectedItemIndex, handleSearchItemClick]);


    const handleSearchKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            console.log(event.key);
            event.preventDefault();

            if (searchResultsRef.current) {
                searchResultsRef.current.focus();
            }

            if (searchResultsMobileRef.current) {
                searchResultsMobileRef.current.focus();
            }


        } else if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }

    }, [handleSearch]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    const toggleCategory = () => {
        setIsCategoriesOpen(true); // isOpen 상태를 토글
    };

    const closeCategory = () => {
        setIsCategoriesOpen(false); // 카테고리를 닫습니다.
    };

    const toggleSearch = (isOpen: boolean) => {
        setIsSearchOpen(isOpen);
        setSearchResults([]);
    }

    return (
        <nav className={styles.navContainer} onMouseLeave={closeCategory} >
            <div className={`${styles.navBar} ${isNavVisible ? styles.open : styles.close}`} >
                <div className={styles.navLeft}>
                    <Link to='' className={styles.logo}>
                        <img src={logo} alt="로고" width="130" height="auto"></img>
                    </Link>
                    <div className={styles.menuBar}>
                        <div className={styles.icon} onClick={() => toggleSearch(!isSearchOpen)}>
                            <img src={searchIcon} alt="검색" style={{ width: 30, height: 30 }} />
                        </div>
                        <div className={styles.menuIcon} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <img src={menuIcon} alt="메뉴" style={{ width: 30, height: 30 }} />
                        </div>
                    </div>


                </div>
                <div className={`${styles.searchMobileContainer} ${styles.menuBar} ${isSearchOpen ? styles.searchOpen : ''}`}>
                    <div className={styles.searchInput}>
                        <input
                            id='searchInput'
                            type="text"
                            placeholder="상품을 검색해보세요!"
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={handleSearchKeyDown}
                            ref={inputMobileRef}
                        />
                        <img src={searchIcon} alt='검색' className={styles.icon} style={{ width: 30, height: 30 }} onClick={handleSearch} />

                        <ul id="searchResults" className={styles.searchResults} tabIndex={0} onKeyDown={handleKeyDown} ref={searchResultsMobileRef}>
                        {searchResults && searchResults.map((result, index) =>
                            result && result.name && (
                                <li
                                    className={index === selectedItemIndex ? styles.selectedItem : ''}
                                    key={index} onClick={() => handleSearchItemClick(index)}>
                                    {result.name}
                                </li>
                            )
                        )}
                    </ul>
                    </div>
                    {/* 검색 결과 리스트 */}
                    
                </div>


                <div className={styles.navMenu}>
                    <div className={styles.productCategory}>
                        <ul>
                            <IconComp defaultIcon={bestIcon} hoverIcon={bestBlueIcon} title={'인기 상품'} link={'/best'} />
                            <IconComp defaultIcon={newIcon} hoverIcon={newBlueIcon} title={'최신 상품'} link={'/new'} />
                            <div onMouseOver={toggleCategory}>
                                <IconComp defaultIcon={allIcon} hoverIcon={allBlueIcon} title={'모든 상품'} link={'/all'} />
                            </div>
                        </ul>
                    </div>

                    <div className={styles.navRight}>
                        <div className={`${styles.searchContainer}`}>
                            <div className={styles.searchInput}>
                                <input
                                    id='searchInput'
                                    type="text"
                                    placeholder="상품을 검색해보세요!"
                                    value={query}
                                    onChange={handleInputChange}
                                    onKeyDown={handleSearchKeyDown}
                                    ref={inputRef}
                                />
                                <img src={searchIcon} alt='검색' className={styles.icon} style={{ width: 30, height: 30 }} onClick={handleSearch} />
                                <ul id="searchResults" className={styles.searchResults} tabIndex={0} onKeyDown={handleKeyDown} ref={searchResultsRef}>
                                    {searchResults && searchResults.map((result, index) =>
                                        result && result.name && (
                                            <li
                                                className={index === selectedItemIndex ? styles.selectedItem : ''}
                                                key={index} onClick={() => handleSearchItemClick(index)}>
                                                {result.name}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                            {/* 검색 결과 리스트 */}
                            
                        </div>
                        <div className={styles.userCategory}>
                            <ul>
                                {!isLoggedIn ? (
                                    // 로그인 되지 않았을 때 로그인 버튼 표시
                                    <IconComp defaultIcon={loginIcon} hoverIcon={loginBlueIcon} title={'로그인'} link={'/login'} />
                                ) : (
                                    // 로그인 되었을 때 마이페이지 버튼 표시
                                    <IconComp defaultIcon={loginIcon} hoverIcon={loginBlueIcon} title={'마이페이지'} link={'/myPage'} />
                                )}
                                <IconComp defaultIcon={cartIcon} hoverIcon={cartBlueIcon} title={'장바구니'} link={'/cart'} />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.categories} ${isMenuOpen ? styles.show : ''} ${isCategoriesOpen ? styles.show : ''}`} onMouseLeave={closeCategory}>
                {categories.map((category) => (
                    <div key={category.name} className={styles.categoryItem}>
                        <Link to={`/categoryProducts/${category.name}`} className={styles.categoryLink}>
                            {category.imageUrl ? (
                                <img src={category.imageUrl} alt={category.name} width="40" />
                            ) : (
                                <img
                                src={`${process.env.PUBLIC_URL}/category/default.png`}
                                alt={category.name}
                                width="40"
                                />
                            )}
                            <p className={styles.categoryTitle}>{category.name}</p>
                        </Link>

                        <ul className={styles.subcategoryList}>
                            {category.subcategories.map((sub, index) => ( // 여기서 index를 사용하여 고유한 key prop을 생성합니다.
                                <Link key={`${category.name}_${index}`} to={`/categoryProducts/${category.name}/${sub.name}`} className={styles.subcategoryLink}>
                                    <li className={styles.subcategoryItem}>{sub.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                ))}

            </div>

            <div className={styles.mobileBottomNav}> {/* 모바일 환경에서 화면 하단에 고정될 컨테이너 */}
                <div className={styles.productUserCategory}> {/* productCategory와 userCategory를 함께 감싸는 컨테이너 */}

                    <ul>
                        <div>
                            <IconComp defaultIcon={bestIcon} hoverIcon={bestBlueIcon} title={'인기 상품'} link={'/best'} size={35} />
                            <p>인기 상품</p>
                        </div>
                        <div>
                            <IconComp defaultIcon={newIcon} hoverIcon={newBlueIcon} title={'최신 상품'} link={'/new'} size={35}/>
                            <p>최신 상품</p>
                        </div>
                        <div>
                            <IconComp defaultIcon={homeICon} hoverIcon={homeICon} title={'홈'} link={'/'} size={35}/>
                            <p>홈</p>
                        </div>


                        {!isLoggedIn ? (
                            // 로그인 되지 않았을 때 로그인 버튼 표시
                            <div>
                                <IconComp defaultIcon={loginIcon} hoverIcon={loginBlueIcon} title={'로그인'} link={'/login'} size={35} />
                                <p>로그인</p>
                            </div>
                        ) : (
                            // 로그인 되었을 때 마이페이지 버튼 표시
                            <div>
                                <IconComp defaultIcon={loginIcon} hoverIcon={loginBlueIcon} title={'마이페이지'} link={'/myPage'} size={35}/>
                                <p>마이페이지</p>
                            </div>
                        )}
                        <div>
                            <IconComp defaultIcon={cartIcon} hoverIcon={cartBlueIcon} title={'장바구니'} link={'/cart'} size={35}/>
                            <p>장바구니</p>
                        </div>
                    </ul>
                </div>
            </div>


        </nav>

    )

}