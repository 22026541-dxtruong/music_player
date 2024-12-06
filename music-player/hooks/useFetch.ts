import { useState, useEffect } from 'react';
import axios from 'axios';
import {FetchError} from "@remix-run/web-fetch/dist/src/errors/fetch-error";

const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FetchError | null>(null);

    const fetchData = async (searchTerm?: string, searchType?: string) => {
        try {
            const params: any = {};
            if (searchTerm) {
                params.query = searchTerm;
            }
            if (searchType) {
                params.type = searchType;
            }
            const response = await axios.get(url, {
                params: params
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
            console.log(response.data);
            setData(response.data);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteData = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(url);
            console.log(response.data);
        } catch (error: any) {
            setError(error);
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const reFetchData = () => {
        fetchData().catch(console.error);
    }

    useEffect(() => {
        fetchData().catch(console.error);
    }, [url]);

    const search = (searchTerm: string, searchType: string) => {
        setLoading(true);
        fetchData(searchTerm, searchType).catch(console.error);
    };

    return { data, loading, error, postData, deleteData, search, reFetchData };
};

export default useFetch;