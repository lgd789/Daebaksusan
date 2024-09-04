import React, { useState } from 'react';
import './CategoryMenuBar.css'; // CSS 파일 임포트

interface CategoryMenuBarProps {
  onCategoryChange: (category: string) => void;
}

export const CategoryMenuBar: React.FC<CategoryMenuBarProps> = ({ onCategoryChange }) => {
  const categories = ['전체', '전복', '소라', '오징어', '광어', '멍게', '기타'];
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className='categoryMenuContainer'>
        <ul>
            {categories.map((category, index) => (
                <React.Fragment key={category}>
                  <li
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={() => {
                      onCategoryChange(category);
                      setSelectedCategory(category);
                    }}
                  >
                    {category}
                  </li>
                  {index !== categories.length - 1 && <span className="divider">|</span>}
                </React.Fragment>
            ))}
        </ul>
    </div>
  );
}

