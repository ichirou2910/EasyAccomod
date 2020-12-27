import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequests = useRef([]);

	const sendRequest = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			setIsLoading(true);
			const httpAbortController = new AbortController();
			activeHttpRequests.current.push(httpAbortController);

			try {
				const res = await fetch(url, {
					method,
					body,
					headers,
					signal: httpAbortController.signal,
				});

				const resData = await res.json();

				activeHttpRequests.current = activeHttpRequests.current.filter(
					(reqCtrl) => reqCtrl !== httpAbortController
				);

				if (!res.ok) {
					throw new Error(resData.message);
				}

				setIsLoading(false);
				return resData;
			} catch (err) {
				setError(err.message || 'Something went wrong, please try again.');
				setIsLoading(false);
				throw err;
			}
		},
		[]
	);

	useEffect(() => {
		const current = activeHttpRequests.current;
		return () => {
			current.forEach((abort) => abort.abort());
		};
	}, []);

	return { isLoading, error, sendRequest };
};
