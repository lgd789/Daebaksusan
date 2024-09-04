import React, { useState, useEffect } from 'react';
import Member from 'types/interface/member.interface';
import { MemberForm } from 'views/join/MemberForm';
import { PasswordConfirmation } from './PasswordConfirmation';
import { SocialReAuthentication } from './SocialReAuthentication';

interface UpdateInfoProps {
    userInfo?: Member;
    isSocialAuthenticated: boolean;
}

export const UpdateInfo: React.FC<UpdateInfoProps> = ({ userInfo, isSocialAuthenticated }) => {
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState<boolean>(false);

    const handlePasswordConfirm = (isConfirmed: boolean) => {
        setIsPasswordConfirmed(isConfirmed);
    };

    const isSocialUser = userInfo?.type === 'naver' || userInfo?.type === 'kakao';
     
    return (
        <div className='text-left'>
            <div className='mt-3 text-left text-2xl border-b font-semibold'> 정보 수정 </div>
            <div className='mt-6 w-3/4 sm:w-1/4'>
                {isSocialUser && !isSocialAuthenticated && (
                    <SocialReAuthentication provider={userInfo?.type} redirectPath="updateInfo"/>
                )}
                {!isSocialUser && !isPasswordConfirmed && (
                    <PasswordConfirmation onConfirm={handlePasswordConfirm} />
                )}
            </div>
            {(isSocialAuthenticated || isPasswordConfirmed) && (
                <MemberForm userInfo={userInfo}/>
            )}
        </div>
    );
};
