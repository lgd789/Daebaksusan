import styles from './Footer.module.css'
import logo from '../assets/logo_sample_bin.png';
import { useState } from 'react';
import Agreement from 'components/Terms/agreement';

export const Footer = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <footer className="bg-[#393B3E]">
      <div className="text-white border-b border-black">
        <div className="grid grid-cols-1 xl:grid-cols-3 w-4/5 m-auto py-3 "> {/* 변경: 폰트 크기 변경 및 모바일 화면에서 1열로, md 화면부터 3열로 나열 */}
          <div className="text-lg xl:text-xl xl:font-bold xl:pl-0 xl:pr-2 xl:pb-0">고객센터 1234-5678</div> {/* 변경: 폰트 크기 및 위치 조정 */}
          <div className="text-sm xl:text-base xl:pl-2 xl:text-center">평일 10:00 - 17:00 (점심 12:00 - 13:00 / 주말 및 공휴일 휴무)</div> {/* 변경: 폰트 크기 조정 */}
          <ul className='flex justify-center text-sm xl:text-base'> {/* 변경: 폰트 크기 및 위치 조정 */}
            <li><button className="pr-2 text-white no-underline" onClick={openModal}>이용약관</button></li>
            <li>|</li>
            <li><button className="pr-2 text-white no-underline" onClick={openModal}>개인정보처리방침</button></li>
            <li>|</li>
            <li><a className="px-2 text-white no-underline" href="/">회사소개</a></li>
          </ul>

        </div>
      </div>



      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* 모달 콘텐츠 */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                      이용약관
                    </h3>
                    {/* 이용약관 내용 */}
                    <div className="mt-2 overflow-y-auto max-h-96">
                      <p className="text-sm text-gray-500">
                        <Agreement />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-600  sm:ml-3 sm:w-auto sm:text-sm" onClick={closeModal}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-4 w-4/5 m-auto text-[#888] text-start leading-8">
        <div className="flex flex-col md:flex-row text-start sm:text-center text-sm md:text-lg text-white font-bold justify-center gap-3">
          <div className="md:pr-2 lg:pr-4">법인 : 어업회사법인 유한회사 대박수산</div>
          <div className="md:px-2 lg:px-4">사업자 등록 번호 : 592-81-02388</div>
          <div className="md:pl-2 lg:pl-4">대표 : 강우복</div>
        </div>



        <div className="flex flex-col md:flex-row justify-center gap-10 py-4">
          <img src={logo} width="130" height="auto" />

          <div>
            <div>대표번호 : 1234-5678</div>
            <div className="flex">
              <div className='pr-2'>통신판매업 신고 : 제 2022-전북군산-0069 호</div>
              <span>|</span>
              <a className="pl-2 text-white no-underline" target="_blank" href="https://www.ftc.go.kr/www/biz/bizCommList.do?key=5375">통신판매업신고확인</a>
            </div>
            <div>주소 : 54166 전라북도 군산시 칠성2길 97(산북동) </div>
            <div>개인정보관리책임자 : 강우복(a01083774151@gmail.com)</div>
            <div>Copyright © 2024 대박수산. All rights reserved.</div>
          </div>

          <div>
            <div>배송안내</div>
            <div>평일(월~금) 오후 5시 이전 주문 시, 당일 발송</div>
            <div>* 무통장 입금 및 카드결제 완료 기준 </div>
            <div>토/일요일 주문 건 차주 영업일 발송</div>
            <div>* 공휴일 및 명절연휴 별도 공지</div>
          </div>
        </div>
      </div>
      <div className="py-2"></div>
    </footer>
  );
};

export default Footer;
