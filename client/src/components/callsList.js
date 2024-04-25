'use client';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Table from '@/components/Table';
import { usePaginatedFetch } from '@/hooks/useFetch';
import { formatDate, formatPhone, formatDuration } from '@/utils/formatters';
import DateFilterBar from '@/components/DateFilterBar';

const CallsList = ({ phone_number }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sort, setSort] = useState({ field: 'created_at', direction: 'asc' });

    const {
        data: calls,
        error,
        setSize,
        isReachingEnd,
        isLoadingMore,
    } = usePaginatedFetch(
        `http://localhost:8000/api/calls/${encodeURIComponent(phone_number)}`,
        startDate,
        endDate,
        `${sort.direction === 'asc' ? '' : '-'}${sort.field}`
    );
    const loaderRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !isReachingEnd &&
                    !isLoadingMore
                ) {
                    setSize((size) => size + 1);
                }
            },
            { threshold: 1 }
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [setSize, isReachingEnd, isLoadingMore]);

    const handleFilter = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleSortChange = (field) => {
        setSort((prevSort) => {
            if (prevSort.field === field) {
                return {
                    field,
                    direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { field, direction: 'asc' };
        });
    };

    const renderSortIndicator = (field) => {
        if (sort.field !== field) return null;
        if (sort.direction === 'asc') {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                    />
                </svg>
            );
        } else {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                    />
                </svg>
            );
        }
    };

    if (error)
        return (
            <div className="text-red-500">Failed to load phone numbers.</div>
        );
    if (calls.length == 0 && !isLoadingMore)
        return <div className="text-red-500">No call history available.</div>;

    const columns = [
        {
            key: 'created_at',
            title: 'Date',
            className: 'px-3 py-3.5 uppercase text-xs font-semibold',
        },
        {
            key: 'counterparty',
            title: 'To',
            className: 'px-3 py-3.5 uppercase text-xs font-semibold',
        },
        {
            key: 'call_type',
            title: 'Type',
            className: 'px-3 py-3.5 text-xs font-semibold',
        },
        {
            key: 'status',
            title: 'Status',
            className: 'px-3 py-3.5 text-xs font-semibold',
        },
        {
            key: 'duration',
            title: 'Duration',
            className: 'px-3 py-3.5 text-xs font-semibold',
        },
    ];

    const statuses = {
        Completed: 'text-green-400 bg-green-400/10',
        Missed: 'text-rose-400 bg-rose-400/10',
    };

    const types = {
        Inbound:
            'inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700',
        Outbound:
            'inline-flex items-center rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700',
    };

    const renderRow = (call) => (
        <tr key={`${call.created_at}-${call.counterparty}`}>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white">
                {formatDate(call.created_at)}
            </td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white">
                {formatPhone(call.counterparty)}
            </td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                {
                    <span className={classNames(types[call.call_type])}>
                        {call.call_type}
                    </span>
                }
            </td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                <div className="flex items-center gap-x-2">
                    <div
                        className={classNames(
                            statuses[call.status],
                            'flex-none rounded-full p-1'
                        )}>
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <div className="text-white">{call.status}</div>
                </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white">
                {formatDuration(call.duration)}
            </td>
        </tr>
    );

    return (
        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="bg-gray-900 py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-white">
                                    Calls History for{' '}
                                    {formatPhone(phone_number)}
                                </h1>
                            </div>
                        </div>
                        <div className="mt-8 flow-root">
                            <DateFilterBar onFilter={handleFilter} />
                            <Table
                                columns={columns}
                                data={calls}
                                renderRow={renderRow}
                                onSortChange={handleSortChange}
                                sortIndicator={renderSortIndicator}
                            />
                            <div ref={loaderRef} className="text-center">
                                {isLoadingMore && !isReachingEnd ? (
                                    <p>Loading...</p>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallsList;
