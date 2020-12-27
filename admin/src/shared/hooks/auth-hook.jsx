import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
	const [token, setToken] = useState(false);
	const [tokenExp, setTokenExp] = useState();
	const [loginInfo, setLoginInfo] = useState({});

	const login = useCallback((info, token, exp) => {
		setToken(token);
		setLoginInfo({
			...info,
		});
		const tokenExp =
			exp || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
		setTokenExp(tokenExp);
		localStorage.setItem(
			'userData',
			JSON.stringify({
				loginInfo: info,
				token: token,
				exp: tokenExp.toISOString(),
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExp(null);
		setLoginInfo({});
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExp) {
			const remainingTime = tokenExp.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExp]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.exp) > new Date()
		) {
			login(storedData.loginInfo, storedData.token, new Date(storedData.exp));
		}
	}, [login]);

	const setInfo = useCallback((info) => {
		setLoginInfo({ ...info });
		let storedData = localStorage.getItem('userData');
		if (storedData) {
			storedData = JSON.parse(storedData);
			storedData['loginInfo'] = { ...info };
			localStorage.setItem('userData', JSON.stringify(storedData));
		}
	}, []);

	return { token, login, logout, loginInfo, setInfo };
};
