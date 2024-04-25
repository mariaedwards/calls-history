import React, { useState } from 'react';
import { validateDate } from '@/utils/validators';
import InputMask from 'react-input-mask';

const DateFilterBar = ({ onFilter }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isErrorStart, setIsErrorStart] = useState(false);
    const [isErrorEnd, setIsErrorEnd] = useState(false);

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setIsErrorStart(false);
        setIsErrorEnd(false);
        onFilter(null, null);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setIsErrorStart(false);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setIsErrorEnd(false);
    };

    const handleFilter = () => {
        if (!validateDate(startDate)) {
            setIsErrorStart(true);
        }
        if (!validateDate(endDate)) {
            setIsErrorEnd(true);
        }
        if (validateDate(startDate) && validateDate(endDate)) {
            onFilter(startDate, endDate);
        }
    };

    return (
        <div className="h-36">
            <div className="flex items-start justify-end gap-4 p-4 my-6">
                <div>
                    <label
                        htmlFor="start-date"
                        className="block text-sm font-medium leading-6 text-white">
                        Start Date (Optional)
                    </label>
                    <div className="mt-2">
                        <InputMask
                            type="text"
                            mask="99-99-9999"
                            id="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            placeholder="MM-DD-YYYY"
                            className="block w-full text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {isErrorStart && (
                        <p className="mt-2 text-sm text-red-600">
                            Invalid start date.
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="end-date"
                        className="block text-sm font-medium leading-6 text-white">
                        End Date (Optional)
                    </label>
                    <div className="mt-2">
                        <InputMask
                            type="text"
                            id="end-date"
                            mask="99-99-9999"
                            value={endDate}
                            onChange={handleEndDateChange}
                            placeholder="MM-DD-YYYY"
                            className="block w-full text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {isErrorEnd && (
                        <p className="mt-2 text-sm text-red-600">
                            Invalid end date.
                        </p>
                    )}
                </div>

                <button
                    onClick={handleClearDates}
                    className="rounded-md bg-white px-2.5 py-1.5 mt-8 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-white-300 hover:bg-white-50">
                    Clear
                </button>
                <button
                    onClick={handleFilter}
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 mt-8  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Filter
                </button>
            </div>
        </div>
    );
};

export default DateFilterBar;
