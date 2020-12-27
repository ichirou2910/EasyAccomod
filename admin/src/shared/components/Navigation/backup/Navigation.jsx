import React, { useContext } from 'react';
import { AuthContext } from '../../../context/auth-context';

import Avatar from '../../UIElements/Avatar';
import Button from '../../FormElements/Button';

import './Navigation.css';

const avatarStyle = {
	border: '4px solid var(--light-secondary-color)',
	backgroundColor: 'var(--light-secondary-color)',
};

const Navigation = () => {
	const auth = useContext(AuthContext);

	return (
		<div className="navigation">
			{auth.isLoggedIn && (
				<div className="navigation__user">
					<Avatar
						image={`${process.env.REACT_APP_HOST_URL}/${auth.loginInfo.avatar}`}
						style={avatarStyle}
						small
					/>
				</div>
			)}
			{!auth.isLoggedIn && <Button to="/auth">JOIN</Button>}
			{auth.isLoggedIn && (
				<Button danger onClick={auth.logout}>
					LOGOUT
				</Button>
			)}
		</div>
	);
};

export default Navigation;
