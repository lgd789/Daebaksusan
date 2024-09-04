import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { QnA } from 'types';
import styles from './QnAList.module.css';
import { Pagination } from 'components/Pagination';
import { Loading } from 'components/Loading/Loading';
import { QnAItemComp } from './QnAItemComp';
import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useAuthContext } from 'hook/AuthProvider';

interface QnAListProps {
    productId: number;
}

export const QnAList: React.FC<QnAListProps> = ({ productId }) => {
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [qnaList, setQnaList] = useState<QnA[] | null>(null);
    const [page, setPage] = useState<number>(1); // 페이지 번호
    const pageSize = 5; // 페이지 크기
    const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지 수
    const qnaListRef = useRef<HTMLDivElement>(null);
    const [questionText, setQuestionText] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, [page, productId]);

    const fetchData = async () => {
        const url = `${process.env.REACT_APP_API_URL}/qna/getQna?productId=${productId}&page=${page}&pageSize=${pageSize}`
        try {
            const response = await axios.get(url);
            console.log(response.data)
            setQnaList(response.data.content);
            setTotalPages(Math.ceil(response.data.totalElements / pageSize));
        } catch (error) {
            console.error('Error fetching Q&A data:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToTop();
    };

    const scrollToTop = () => {
        if (qnaListRef.current) {
            qnaListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSubmitQuestion = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const url = `/qna/ask`;
            const post = 'POST';
            const data = {
                productId: productId,
                questionText: questionText,
            };
            const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);


            setQuestionText('');

            fetchData();
        } catch (error) {
            alert('로그인 후 이용해주세요.')
        }
    };

    return (
        <div className={styles.qnaListContainer} ref={qnaListRef}>
            <div className={styles.qnaFormContainer}>
                <form className={styles.qnaForm} onSubmit={handleSubmitQuestion}>
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="질문을 입력해주세요..."
                        rows={4}
                        cols={50}
                        required
                    />
                    <button type="submit">질문하기</button>
                </form>
            </div>
        
           
            {qnaList ? (
                <>
                    <QnAItemComp qnaList={qnaList}/>
                    <Pagination pageSize={pageSize} totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
};
