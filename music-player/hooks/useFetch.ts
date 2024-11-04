import { useState, useEffect } from 'react';
import axios from 'axios';
import {FetchError} from "@remix-run/web-fetch/dist/src/errors/fetch-error";

const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FetchError | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData().catch(console.error);
    }, [url]);

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

    return { data, loading, error, postData };
};

export default useFetch;