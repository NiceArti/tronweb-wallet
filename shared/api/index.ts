import { useCallback, useState } from "react";
import axios, { AxiosRequestConfig } from 'axios';
import { API_URL } from "../config";

export const useApi = () => {
	const [data, setData] = useState(null); // Состояние для данных
	const [error, setError] = useState(null); // Состояние для ошибок
	const [loading, setLoading] = useState(false); // Состояние загрузки

	const axiosInstance = axios.create({
		baseURL: API_URL,
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
			
		}
	});
	
	const fetchData = useCallback(
		async (config: AxiosRequestConfig) => {
			setLoading(true);
			setError(null);
		
			const controller = new AbortController();
			const { signal } = controller;
			
			try {
				const response = await axiosInstance({ 
					...config,
					signal,
				}); // Выполнение запроса с поддержкой отмены

				return response.data;
			} catch (err: any) {
				if (axios.isCancel(err)) {
					console.log('Запрос отменен');
				} else {
					setError(err.message); // Установка ошибки в состояние
				}
			} finally {
				setLoading(false); // Установка состояния загрузки в false
			}
		
			return () => controller.abort(); // Возврат функции для отмены запроса
		},
		[axiosInstance]
	);
	
	// Упрощенные функции для различных типов запросов
	const get = useCallback((url: string, data?: any, config = {}) => fetchData({ ...config, url: `${API_URL}${url}`, method: 'GET', data }), [fetchData]);
	const post = useCallback((url: string, data?: any, config = {}) => fetchData({ ...config, url: `${API_URL}${url}`, method: 'POST', data }), [fetchData]);
	const patch = useCallback((url: string, data?: any, config = {}) => fetchData({ ...config, url: `${API_URL}${url}`, method: 'PATCH', data }), [fetchData]);
	const put = useCallback((url: string, data?: any, config = {}) => fetchData({ ...config, url: `${API_URL}${url}`, method: 'PUT', data }), [fetchData]);
	const del = useCallback((url: string, config = {}) => fetchData({ ...config, url: `${API_URL}${url}`, method: 'DELETE' }), [fetchData]);

	return { data, error, loading, get, post, put, patch, del };
}
