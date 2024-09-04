import React from 'react';
import styles from './PointsDetil.module.css'
import { PointsDetails } from 'types';

interface PointsDetailProps {
  pointsTransactions: PointsDetails[]
}


export const PointsDetail: React.FC<PointsDetailProps> = ({ pointsTransactions }) => {
  return (
    <div className={styles.pointsDetailContainer}>
      <table>
        <thead>
          <tr>
            <th>적립/사용일</th>
            <th>내용</th>
            <th>적립/사용 금액</th>
            <th>소계</th>
          </tr>
        </thead>
        <tbody>
          {pointsTransactions.map((transaction, index) => (
            <tr key={index}>

              <td>
                {transaction && transaction.date ? (
                  <>
                    {new Date(transaction.date).toLocaleDateString('ko-KR')}<br/>
                    {new Date(transaction.date).toLocaleTimeString('ko-KR')}
                  </>
                ) : '-'}
              </td>
              <td>{transaction.description}</td>
              <td style={{ color: transaction.usageAmount > 0 ? 'blue' : 'red' }}>
                {transaction.usageAmount > 0 ? '+' : '' }{transaction.usageAmount}
              </td>
              <td>{transaction.subTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
