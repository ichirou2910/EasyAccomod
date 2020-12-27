import React, { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';
import { Navbar, NavItem, DropdownMenu, DropdownItem } from './Navbar';

import { ReactComponent as ChatIcon } from '../../../icons/chat.svg';
import { ReactComponent as BellIcon } from '../../../icons/bell.svg';
import { ReactComponent as CaretIcon } from '../../../icons/caret.svg';
import { ReactComponent as PostIcon } from '../../../icons/post.svg';
import { ReactComponent as LogoutIcon } from '../../../icons/logout.svg';

import './Navigation.css';

const Navigation = () => {
	const auth = useContext(AuthContext);
	return (
		<div className="navigation">
			<Navbar>
				{auth.isLoggedIn && (
					<>
						<NavItem icon={<ChatIcon />} to="/admin/chat" />
						<NavItem icon={<BellIcon />} to="/admin/notification" />
						<NavItem icon={<PostIcon />} to="/admin/posts" />
					</>
				)}
				<NavItem icon={<CaretIcon />}>
					<DropdownMenu>
						<DropdownItem icon={<LogoutIcon />} action={auth.logout}>
							Logout
						</DropdownItem>
						)}
					</DropdownMenu>
				</NavItem>
			</Navbar>
		</div>
	);
};

export default Navigation;
