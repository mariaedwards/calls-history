'use client';
import {useEffect, useRef } from 'react';
import classNames from 'classnames';
import Table from '@/components/Table';
import { usePaginatedFetch } from '@/hooks/useFetch'; // Make sure this imports correctly
import { formatDate, formatPhone, formatDuration } from '@/utils/formatters';

const CallsList = ({ phone_number }) => {
    const { data: calls,error, setSize, isReachingEnd, isLoading } = usePaginatedFetch(`http://localhost:8000/api/calls/${encodeURIComponent(phone_number)}`);
    const loaderRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isReachingEnd && !isLoading) {
                setSize(size => size + 1);
            }
        }, { threshold: 1 });
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [setSize, isReachingEnd, isLoading]);

    if (error) return <div className="text-red-500">Failed to load phone numbers.</div>;
    if (!calls && calls.length != 0) return <div>Loading...</div>;
    if (calls.length == 0) return <div className="text-red-500">No call history available.</div>;

    const columns = [
        { key: 'date', title: 'Date', className: 'px-3 py-3.5 uppercase text-xs font-semibold' },
        { key: 'to', title: 'To', className: 'px-3 py-3.5 uppercase text-xs font-semibold' },
        { key: 'type', title: 'Type', className: 'px-3 py-3.5 text-xs font-semibold' },
        { key: 'status', title: 'Status', className: 'px-3 py-3.5 text-xs font-semibold' },
        { key: 'duration', title: 'Duration', className: 'px-3 py-3.5 text-xs font-semibold' }
    ];

    const statuses = {
        Completed: 'text-green-400 bg-green-400/10',
        Missed: 'text-rose-400 bg-rose-400/10',
    };

    const types = {
        Inbound: 'inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700',
        Outbound: 'inline-flex items-center rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700',
    };

    const renderRow = (call) => (
        <tr key={`${call.created_at}-${call.counterparty}`}>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white">{formatDate(call.created_at)}</td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white">{formatPhone(call.counterparty)}</td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm">{<span className={classNames(types[call.call_type])}>{call.call_type}</span>}</td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                <div className="flex items-center gap-x-2">
                    <div className={classNames(statuses[call.status], 'flex-none rounded-full p-1')}>
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <div className="text-white">{call.status}</div>
                </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3.5 text-sm text-white">{formatDuration(call.duration)}</td>
        </tr>
    );

    return (
        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="bg-gray-900 py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-white">Calls History for {formatPhone(phone_number)}</h1>
                            </div>
                        </div>
                        <div className="mt-8 flow-root">
                            <Table columns={columns} data={calls} renderRow={renderRow} keyExtractor={(item) => `${item.created_at}-${item.counterparty}`} />
                            <div ref={loaderRef} className="text-center">
                                {isLoading ? <p>Loading more...</p> : (isReachingEnd ? <p>No more data.</p> : null)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallsList;
