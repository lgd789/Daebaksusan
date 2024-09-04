import React  from 'react';

interface TermsProps {
  agreement: boolean | null;
  onSubmit: (agreement: boolean) => void;

  content: string; // 약관 내용을 위한 prop 추가
}

const TermsOfServiceComp: React.FC<TermsProps> = ({ agreement, onSubmit, content }) => {

  
  return (
    <>
      <form className='mt-20'>
        <h2>약관 동의서</h2>
        <div className="overflow-y-scroll border-2 border-gray-200 rounded-lg max-h-64 max-w-7xl p-3 m-10">
          <p>{content}</p> {/* 동적으로 약관 내용을 렌더링 */}
        </div>
        <p>서비스 이용을 위해서는 약관에 동의하셔야 합니다.</p>

        <div>
          <label className="inline-flex items-center mr-4">
            <input type="radio" name="agreement" value="agree" className="hover:cursor-pointer form-radio" checked={agreement === true} onChange={() => onSubmit(true)}></input>
            <span className="ml-2">동의함</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="agreement" value="disagree" className="hover:cursor-pointer form-radio" checked={agreement === false} onChange={() => onSubmit(false)}></input>
            <span className="ml-2">동의안함</span>
          </label>
        </div>
        <div className="mt-10 ml-10 mr-10 border-dashed border-b-2 border-blue-200"></div>
      </form>
    </>
  );
};

export default TermsOfServiceComp;
