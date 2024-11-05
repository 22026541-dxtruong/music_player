import { useState, useEffect } from 'react';
import axios from 'axios';
import {FetchError} from "@remix-run/web-fetch/dist/src/errors/fetch-error";

const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FetchError | null>(null);

    const fetchData = async (searchTerm?: string) => {
        try {
            const response = await axios.get(url, {
                params: searchTerm ? { query: searchTerm } : {},
            });
            setData(response.data);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const postData = async (postData: any) => {
        setLoading(true);
        try {
            const response = await axios.post(url, postData);
            setData(response.data);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData().catch(console.error);
    }, [url]);

    const search = (searchTerm: string) => {
        setLoading(true);
        fetchData(searchTerm).catch(console.error);
    };

    return { data, loading, error, postData, search };
};

export default useFetch;