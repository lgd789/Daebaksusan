import Cookies from 'js-cookie';
import {sendRequestWithToken} from 'apis/sendRequestWithToken';
import { Cart, CartInput, CartItem } from 'types';
import { useAuthContext } from 'hook/AuthProvider';

export const saveCartItemsToDatabase = async (cartItems: CartInput[], setIsLoggedIn: (value: boolean) => void) => {
    try {
        // 카트 아이템들을 데이터베이스에 저장하는 API 요청
        const url = '/cart/cookieSave';
        const post = 'POST';
        const data = cartItems;
        console.log(cartItems)
        const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);
        

        // 데이터베이스에 저장된 후에는 쿠키 삭제
        Cookies.remove('cartItems');
    } catch (error) {
        console.error('장바구니 데이터 저장 실패:', error);
    }
};

export const fetchCartItems = async (setCartItems: React.Dispatch<React.SetStateAction<Cart[]>>, setIsLoggedIn: (value: boolean) => void) => {
    try {
        const cartCookie = Cookies.get('cartItems');
        console.log('aaaa', cartCookie)
        if (cartCookie) {
            const parsedCartItems: CartItem[] = JSON.parse(cartCookie);

            // 파싱된 카트 아이템들을 데이터베이스에 저장
            const cartItemsToSave: CartInput[] = parsedCartItems.map((parsedCartItem: CartItem) => ({
                productId: parsedCartItem.product.productId,
                optionId: parsedCartItem.option?.optionId || null, // 선택된 옵션이 없을 경우를 대비하여 기본값 설정
                quantity: parsedCartItem.quantity,
                boxCnt: parsedCartItem.boxCnt
            }));

            // 데이터베이스에 저장
            await saveCartItemsToDatabase(cartItemsToSave, setIsLoggedIn);
        }

        const url = '/cart/get';
        const response = await sendRequestWithToken(url, 'GET', null, setIsLoggedIn);
        console.log(response)
        const parsedCartItems: Cart[] = response.map((item: any) => ({
            cartId: item.cartId,
            cartItem: item.cartItem,
            isSelected: true,
        }));

        setCartItems(parsedCartItems);
    } catch (error) {
        console.error('API 요청 실패:', error);
        const cartCookie = Cookies.get('cartItems');
        if (cartCookie) {
            const parsedCartItems: CartItem[] = JSON.parse(cartCookie);
            const updatedCartItems = parsedCartItems.map((item, index) => ({
                cartId: index,
                cartItem: item,
                isSelected: true,
            }));
            setCartItems(updatedCartItems);
        }
        else {
            setCartItems([])
        }
    }

};


export const fetchCartItemsDelete = async (cartItems: Cart[], setCartItems: React.Dispatch<React.SetStateAction<Cart[]>>, setIsLoggedIn: (value: boolean) => void) => {
    // 선택되지 않은 아이템만 필터링하여 상태에서 유지
    try {
        console.log(cartItems)
        const remainingItemsNotSelect = cartItems.filter(item => !item.isSelected);
        const remainingItemstSelect = cartItems.filter(item => item.isSelected);

        const url = '/cart/delete';
        const post = 'POST';
        const data = remainingItemstSelect.map(item => item.cartId);
        console.log(data)

        const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);
        console.log(response);
        setCartItems(remainingItemsNotSelect);
    }
    catch (error) {
        const remainingItemsNotSelect = cartItems.filter(item => !item.isSelected);
        const remainingItemsCookie = remainingItemsNotSelect.map(item => item.cartItem);
        Cookies.set('cartItems', JSON.stringify(remainingItemsCookie));
        setCartItems(remainingItemsNotSelect);
    }

    


};
