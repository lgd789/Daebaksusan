import { DetailTabComp } from 'components/DetailTabComp';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Cart, CartItem, Option } from 'types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { CONNREFUSED } from 'dns';
import Product from 'types/interface/product-item.interface';
import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useCart } from 'hook/CartProvider';
import { useAuthContext } from 'hook/AuthProvider';
import ImageGalleryComp from 'components/ImageGallery/ImageGalleryComp';
import { ProductListComp } from 'components/product/ProductListComp';
import { Loading } from 'components/Loading/Loading';

// interface CartItem {
//     product: Product;
//     option?: Option | null;
//     quantity: number;
//     boxCnt: number;
// }


export const Detail: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useCart();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const { productId } = useParams<{ productId: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [option, setOption] = useState<Option | null>(null);
    const [optionPrice, setOptionPrice] = useState<number>(0);
    const [boxCnt, setBoxCnt] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/${productId}`);
                const productData = response.data;
                setProduct(productData);

                setTotalPrice((productData.regularPrice - productData.salePrice) * 1 + (productData.shippingCost * 1));
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        setOptions([]);
        setQuantity(1);
        setOption(null);
        setOptionPrice(0);
        setBoxCnt(1);
        setTotalPrice(0);

        fetchProduct();
    }, [productId]);

    // Fetch options for the product
    useEffect(() => {
        if (!product) return;

        const fetchOptions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/${product!.productId}/options`);
                setOptions(response.data);
                setOption(response.data[0]);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, [product]);

    useEffect(() => {
        if (!product) return;

        window.scrollTo(0, 0);
        addToRecentProducts(product);
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Product[]>(`${process.env.REACT_APP_API_URL}/product/recommend`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching recommended products:', error);
            }
        };

        fetchData();
    }, []);

    if (!product) {
        return <Loading />;
    }

    const addToRecentProducts = (product: Product) => {
        const maxRecentProducts = 7;
        const recentProducts = Cookies.get('recentProducts') ? JSON.parse(Cookies.get('recentProducts')!) : [];

        const updatedRecentProducts = recentProducts.filter((p: Product) => p.productId !== product!.productId);
        updatedRecentProducts.unshift(product);

        if (updatedRecentProducts.length > maxRecentProducts) {
            updatedRecentProducts.pop();
        }

        Cookies.set('recentProducts', JSON.stringify(updatedRecentProducts), { expires: 1 });
    };

    // Scroll event handler
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const sticky = scrollTop > 100; // 100px 이상 스크롤되었을 때 sticky 상태로 변경
        setIsSticky(sticky);
    };

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    const handleQuantityChange = (value: number) => {
        if (!product) return;

        const newQuantity = quantity + value;
        let q: number = 1;
        let boxCnt = 1;
        if (newQuantity >= 1 && newQuantity <= product!.stockQuantity) {
            q = newQuantity;
        } else if (newQuantity < 1) {
            q = 1; // 최소 수량은 1로 유지
        } else {
            q = product!.stockQuantity; // 재고 수량으로 수량 조정
        }
        setQuantity(q);
        boxCnt = Math.ceil(q / product!.maxQuantityPerDelivery);
        setBoxCnt(boxCnt);
        setTotalPrice((product!.regularPrice - product!.salePrice) * q + ((product!.shippingCost + optionPrice) * boxCnt));
    };

    const handleQuantityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!product) return;

        const value = event.target.value;
        let q: number = 1;
        let boxCnt = 1;
        if (value === "" || value === "0") {
            q = 1; // 빈 문자열 또는 0 입력 시 최소 수량 1로 설정
        } else {
            const newValue = parseInt(value);
            if (!isNaN(newValue) && newValue >= 1 && newValue <= product!.stockQuantity) {
                q = newValue;
            } else if (newValue > product!.stockQuantity) {
                q = product!.stockQuantity; // 재고 수량으로 수량 조정
            }
        }
        setQuantity(q);
        boxCnt = Math.ceil(q / product!.maxQuantityPerDelivery);
        setBoxCnt(boxCnt);
        setTotalPrice((product!.regularPrice - product!.salePrice) * q + ((product!.shippingCost + optionPrice) * boxCnt));
    };

    const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const optionId = Number(event.target.value);
        const selectedOption = options.find(option => option.optionId === optionId);

        // 옵션 선택에 따른 추가 금액을 총 금액에 반영
        if (selectedOption) {
            setOptionPrice(selectedOption.addPrice);
            setTotalPrice((product!.regularPrice - product!.salePrice) * quantity + ((product!.shippingCost + selectedOption.addPrice) * boxCnt));
            setOption(selectedOption);
        } else {
            setOption(null);
        }
    };

    const showList = (quantity: number, maxQuantityPerDelivery: number) => {
        if (!product) return null;

        let arr = [];
        const n = Math.ceil(quantity / maxQuantityPerDelivery);
        let count = 0;

        for (let i = 0; i < n; i++) {
            count = Math.min(maxQuantityPerDelivery, quantity - (i * maxQuantityPerDelivery));
            arr.push(
                <div key={i} className="border-gray-200 px-4 py-1 grid grid-cols-3 place-items-center">
                    <div>
                        <div className="text-sm lg:text-base">{product!.name}</div>
                        <div className='text-sm text-gray-400'>- {option?.name}({option?.addPrice.toLocaleString()}) 배송 비({product!.shippingCost.toLocaleString()}) - </div>
                    </div>
                    <div>{count}개</div>
                    <div>{((product!.regularPrice - product!.salePrice) * count + optionPrice + product!.shippingCost).toLocaleString()} 원</div>
                </div>
            );
        }
        return arr;
    };

    const handleAddToCart = async () => {
        try {

            if (quantity > product!.stockQuantity) {
                alert('재고가 초과되었습니다.');
                return;
            }

            const cartInputItem = {
                productId: product!.productId,
                optionId: option?.optionId,
                quantity: quantity,
                boxCnt: boxCnt
            };

            const url = '/cart/cartSave';
            const post = 'POST';
            const data = cartInputItem;

            const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);
            console.log(response);

            const updatedCartItems = cartItems.map(cart => {
                if (cart.cartId === response.cartId) {
                    // 이미 해당 ID를 가진 카트 아이템이 존재하면 업데이트
                    return {
                        ...cart,
                        id: response.cartId,
                        cartItem: {
                            product: product,
                            option,
                            quantity: response.quantity,
                            boxCnt: response.boxCnt,
                        },
                        isSelected: true
                    };
                }
                return cart;
            });


            const isNewItem = updatedCartItems.every(cart => cart.cartId !== response.cartId);

            if (isNewItem) {
                // 새로운 아이템일 경우 목록에 추가
                const newCart: Cart = {
                    cartId: response.cartId,
                    cartItem: {
                        product: product,
                        option,
                        quantity,
                        boxCnt,
                    },
                    isSelected: true
                };
                setCartItems([newCart, ...updatedCartItems]);
            } else {
                // 기존 아이템을 업데이트한 경우 업데이트된 목록으로 설정
                setCartItems(updatedCartItems);
            }


        } catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error);
                alert(error.response.data);
                return;
            }

            const existingCartCookie = Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')!) : [];;

            // 장바구니에 추가하려는 상품과 옵션에 대한 정보
            const newItem: CartItem = {
                product: product,
                option: option,
                quantity: quantity,
                boxCnt: boxCnt,
            };

            let updatedCartItems: CartItem[] = [];

            // 기존에 선택된 상품이 있는지 확인
            const existingItemIndex = existingCartCookie.findIndex((item: CartItem) => {
                return item.product!.productId === product!.productId && item.option?.optionId === option?.optionId;
            });

            // 기존에 선택된 상품이 있을 경우, 쿠키에서 해당 아이템을 찾아 업데이트합니다.
            if (existingItemIndex !== -1) {
                // 기존에 선택된 상품이 있을 경우, 수량을 합산하여 업데이트
                const existingItem = existingCartCookie[existingItemIndex];
                const updatedQuantity = existingItem.quantity + quantity;

                if (updatedQuantity > existingItem.product!.stockQuantity) {
                    alert('재고가 초과되었습니다.');
                    return;
                }
                const updatedBoxCnt = Math.ceil(updatedQuantity / existingItem.product!.maxQuantityPerDelivery);

                // 기존 아이템을 업데이트합니다.
                existingCartCookie[existingItemIndex] = {
                    ...existingItem,
                    quantity: updatedQuantity,
                    boxCnt: updatedBoxCnt
                };

                // 업데이트된 아이템 목록을 새로운 카트 아이템 목록으로 설정합니다.
                updatedCartItems = existingCartCookie;
            } else {
                // 기존에 선택된 상품이 없을 경우, 새로운 상품으로 추가합니다.
                updatedCartItems = [newItem, ...existingCartCookie];
            }
            // 쿠키에 업데이트된 장바구니 정보 저장
            // 현재 날짜와 시간
            const currentDate = new Date();
            // 0.5일 후의 시간 (12시간 * 60분 * 60초 * 1000밀리초)
            const halfDayLater = currentDate.getTime() + (12 * 60 * 60 * 1000);

            Cookies.set('cartItems', JSON.stringify(updatedCartItems), { expires: new Date(halfDayLater) });

            const newCartItems = updatedCartItems.map((item, index) => ({
                cartId: index,
                cartItem: item,
                isSelected: true,
            }));
            setCartItems(newCartItems);

        }
        alert('장바구니에 상품이 추가되었습니다.');
    };

    const handleGoToOrder = () => {
        if (quantity > product!.stockQuantity) {
            alert('재고가 초과되었습니다.');
            return;
        }

        const newItem: CartItem = {
            product: product,
            option: option,
            quantity: quantity,
            boxCnt: boxCnt,
        };

        const newCart: Cart = {
            cartId: -1,
            cartItem: newItem,
            isSelected: true
        }

        // 장바구니 isSelect false로 해야함


        navigate('/order', {
            state: {
                cartItems: [newCart]
            }
        });
    }

    const isSoldOut = (product!.stockQuantity === 0)

    return (
        <div className='bg-white text-gray-700'>

            <main className="container mx-auto my-8 p-4">
                <div className="flex flex-wrap md:flex-nowrap items-stretch relative">

                    <div className="w-full lg:w-1/2 px-4">
                        <img src={product!.imageUrl} alt={product!.imageUrl} className="w-full h-96 object-cover m-auto rounded  " />
                    </div>
                    <div className="w-full lg:w-1/2 border-t-2 border-b-2 border-blue-700">

                        <div className='text-2xl text-blue-700 font-bold p-3'>{product!.name}</div>
                        <h1 className="text-xl text-gray-500 font-bold border-gray-200 p-2">{product!.description}</h1>

                        <div className="">
                            <div className="text-start border-b-2 border-gray-200 px-4 py-1">
                                <div className="grid grid-cols-5">
                                    <div className="font-bold">판매가</div>
                                    <div className="col-span-4 text-xl">{(product!.regularPrice - product!.salePrice).toLocaleString()}원</div>
                                </div>
                            </div>
                            <div className="grid grid-rows-3 text-start border-b-2 border-gray-200 px-4 py-1">
                                <div className="grid grid-cols-5">
                                    <div className="font-bold">원산지</div>
                                    <div className="col-span-4">완도군</div>
                                </div>
                                <div className="grid grid-cols-5">
                                    <div className="font-bold">배송</div>
                                    <div className="col-span-4">택배</div>
                                </div>
                                <div className="grid grid-cols-5">
                                    <div className="font-bold">배송 비</div>
                                    <div className="col-span-4">{product!.shippingCost.toLocaleString()}원</div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <label htmlFor="option-select" className="mb-2"><strong className="text-blue-700">[필수]</strong> 옵션 선택 </label>
                            <select
                                id="option-select"
                                className="w-full border-2 border-blue-700 rounded p-2 focus:ring-1 focus:ring-blue-700"
                                onChange={handleOptionSelect}
                                disabled={isSoldOut}
                            >
                                {options.map((option: Option) => (
                                    <option key={option.optionId} value={option.optionId}>
                                        <div> {option.name}</div>
                                        <div> +{(option.addPrice).toLocaleString()}원</div>
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='rounded-lg shadow-md border-1 mx-4 my-3'>
                            {showList(quantity, product!.maxQuantityPerDelivery)}
                        </div>

                        <div className="flex justify-center space-x-2 py-4">
                            <button className="bg-blue-700 text-sm text-white font-bold px-4 py-2 rounded" onClick={() => handleQuantityChange(-1)} disabled={isSoldOut}>-</button>
                            <input
                                type="text"
                                value={quantity.toLocaleString()}
                                onChange={handleQuantityInputChange}
                                className="w-16 text-center text-sm border border-gray-300 rounded"
                                disabled={isSoldOut}
                            />
                            <button className="bg-blue-700 text-sm text-white font-bold px-4 py-2 rounded" onClick={() => handleQuantityChange(1)} disabled={isSoldOut}>+</button>
                        </div>
                        <div className="flex justify-between  border-2 border-blue-700 rounded">
                            <div className="text-2xl p-4 font-bold text-white bg-blue-700">최종 금액</div>
                            <div className='text-2xl p-4 font-bold text-blue-700 text-end'>{totalPrice.toLocaleString()} 원</div>
                        </div>
                        <div className="flex justify-center space-x-2 py-4">
                            <button className="bg-blue-700 text-white font-bold px-4 py-2 rounded" disabled={isSoldOut} onClick={handleGoToOrder}>구매하기</button>
                            <button className="bg-blue-700 text-white font-bold px-4 py-2 rounded" disabled={isSoldOut} onClick={handleAddToCart}>장바구니</button>

                        </div>


                    </div>
                    {isSoldOut && (
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60  flex justify-center items-center">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-white">상품 품절</p>
                                <p className="text-lg text-white">죄송합니다. 이 상품은 현재 품절되었습니다.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="my-8 w-full ">
                    <h2 className="text-2xl font-bold my-4">오늘의 <strong className='text-blue-700'>추천</strong> 상품 !</h2>
                    <div className="gap-4">
                        <ImageGalleryComp items={products} size="275px" fontSize="7px" component={ProductListComp}/>
                    </div>
                </div>

                <div className={"my-8 w-full"}>
                    <DetailTabComp productId={product!.productId} />
                </div>
            </main>


        </div>
    );
}
