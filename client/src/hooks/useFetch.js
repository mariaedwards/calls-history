import useSWRInfinite from 'swr/infinite';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export const usePaginatedFetch = (url) => {
    const { data, size, setSize, error } = useSWRInfinite(
        (pageIndex, previousPageData) => {
            // If there's no more data, return null
            if (previousPageData && !previousPageData.next) return null;
            // Add the page parameter to the URL
            return `${url}?page=${pageIndex + 1}`;
        },
        fetcher,
        { persistSize: true }
    );

    const isLoadingInitialData = !data && !error;
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.next === null);

    return { data:  data ? data.flatMap(page => page.results) : [], error, isLoadingMore, size, setSize, isReachingEnd };
};
