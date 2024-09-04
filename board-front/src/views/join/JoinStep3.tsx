import axios from 'axios';
import { AddressFinderButton } from 'components/Button/AddressFinderButton';
import JoinTimeLineComp from 'components/JoinTimeLineComp';
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressData, AddressObj } from 'types';
import { MemberForm } from './MemberForm';

export const JoinStep3: React.FC = () => {
    return (
        <div className="container mt-10 py-5 rounded-lg">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl text-blue-600 font-semibold">회원가입</h1>
            </div>
            <div className="py-2">
                <div className="sm:flex sm:justify-between">
                    <div className="sm:w-1/5 sm:border-r sm:text-l font-semibold">
                        <div className="space-y-6 mt-10">
                            <div className="">
                                <JoinTimeLineComp currentStep={3} />
                            </div>
                        </div>
                    </div>
                    <div className="sm:container">
                        <div className="bg-white sm:p-6">
                            <MemberForm />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
