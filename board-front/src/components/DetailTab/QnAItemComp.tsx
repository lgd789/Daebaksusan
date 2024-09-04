import React from 'react'
import { QnA } from 'types';
import styles from './QnAItemComp.module.css';

interface QnAItemCompProps {
    qnaList: QnA[];
}

export const QnAItemComp: React.FC<QnAItemCompProps> = ({ qnaList }) => {
    return (
        <ul className={styles.qnaList}>
            {qnaList.map((qna) => (
                <li key={qna.question.questionId}>
                    {qna.question &&
                        <div className={styles.question}>
                            <div className={styles.userInfo}>
                                <span><span className={styles.questionLable}>질문</span> {qna.question.name}</span>
                                <span>{new Date(qna.question.createdAt).toLocaleString('ko-KR')}</span>
                            </div>

                            <div className={styles.questionContent}>
                                {qna.question.question.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>

                        </div>
                    }

                    {qna.answers.map((answer) =>
                        <div className={styles.answerContanier}>
                            <div className={styles.answerArrow}>⤷</div>
                            <div className={styles.answer}>
                                <div className={styles.userInfo}>
                                    <span><span className={styles.answerLable}>답변</span> 대박수산</span>
                                    <span>{new Date(answer.createdAt).toLocaleString('ko-KR')}</span>
                                </div>
                                <div className={styles.answerContent}>
                                    {answer.content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </div>

                            </div>
                        </div>
                   )}
                </li>
            ))}

        </ul>
    )
}
