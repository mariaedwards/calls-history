'use client';
import Table from '@/components/Table';
import { useEffect, useRef } from 'react';
import { usePaginatedFetch } from '@/hooks/useFetch';
import { formatPhone, formatDate, formatDuration } from '@/utils/formatters';
import classNames from 'classnames';
import Link from 'next/link';

const PhonesList = () => {
    const {
        data: phones,
        error,
        isLoadingMore,
        setSize,
        isReachingEnd,
    } = usePaginatedFetch('http://localhost:8000/api/phone-numbers');
    const loaderRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isReachingEnd) {
                    setSize((size) => size + 1);
                }
            },
            { threshold: 1.0 }
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [setSize, isReachingEnd]);

    if (error)
        return (
            <div className="text-red-500">Failed to load phone numbers.</div>
        );
    if (!phones && phones.length != 0) return <div>Loading...</div>;
    if (phones.length == 0)
        return <div className="text-red-500">No phones available.</div>;

    const columns = [
        {
            key: 'number',
            title: 'Number',
            className: 'px-3 py-3.5 uppercase text-xs font-semibold',
        },
        {
            key: 'added',
            title: 'Added',
            className:
                'px-3 py-3.5 uppercase text-xs font-semibold hidden sm:table-cell',
        },
        {
            key: 'status',
            title: 'Status',
            className: 'px-3 py-3.5 text-xs font-semibold',
        },
        {
            key: 'totalDuration',
            title: 'Total Duration',
            className: 'px-3 py-3.5 text-xs font-semibold hidden sm:table-cell',
        },
        {
            key: 'numberCompleted',
            title: 'Number Completed',
            className: 'px-3 py-3.5 text-xs font-semibold hidden sm:table-cell',
        },
        {
            key: 'numberMissed',
            title: 'Number Missed',
            className: 'px-3 py-3.5 text-xs font-semibold hidden sm:table-cell',
        },
    ];

    const statuses = {
        Active: 'text-green-400 bg-green-400/10',
        Inactive: 'text-rose-400 bg-rose-400/10',
    };

    const renderRow = (phone) => {
        const status = phone.is_active ? 'Active' : 'Inactive';
        const statusClass = classNames(
            statuses[status],
            'flex-none rounded-full p-1'
        );

        return (
            <tr key={phone.number}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                    <Link
                        href={`/${phone.number}`}
                        className={classNames(
                            'text-pink-300 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6'
                        )}>
                        {formatPhone(phone.number)}
                    </Link>
                </td>

                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white hidden sm:table-cell">
                    {formatDate(phone.created_at)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                    <div className="flex items-center gap-x-2">
                        <div className={statusClass}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <div className="text-white">{status}</div>
                    </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white hidden sm:table-cell">
                    {formatDuration(phone.average_duration)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white hidden sm:table-cell">
                    {phone.completed_calls}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white hidden sm:table-cell">
                    {phone.missed_calls}
                </td>
            </tr>
        );
    };

    return (
        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="bg-gray-900 py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-white">
                                    Phone Numbers
                                </h1>
                                <p className="mt-2 text-sm text-gray-300">
                                    A list of all the phone numbers in your
                                    account.
                                </p>
                            </div>
                        </div>
                        <Table
                            columns={columns}
                            data={phones || []}
                            renderRow={renderRow}
                            keyExtractor={(item) => item.number}
                        />
                        <div ref={loaderRef}>
                            {isLoadingMore ? <p>Loading more...</p> : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhonesList;
