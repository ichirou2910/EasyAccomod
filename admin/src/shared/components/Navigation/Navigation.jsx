import React, { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';
import { Navbar, NavItem, DropdownMenu, DropdownItem } from './Navbar';

import { ReactComponent as PlusIcon } from '../../../icons/plus.svg';
import { ReactComponent as ChatIcon } from '../../../icons/chat.svg';
import { ReactComponent as UserIcon } from '../../../icons/user.svg';
import { ReactComponent as BellIcon } from '../../../icons/bell.svg';
import { ReactComponent as CaretIcon } from '../../../icons/caret.svg';
import { ReactComponent as PostIcon } from '../../../icons/list.svg';
import { ReactComponent as LogoutIcon } from '../../../icons/logout.svg';

import './Navigation.css';

const Navigation = () => {
	const auth = useContext(AuthContext);
	return (
		<div className="navigation">
			<Navbar>
				{auth.isLoggedIn && (
					<>
						<NavItem icon={<PlusIcon />} to="/admin/place/create" />
						<NavItem icon={<UserIcon />} to="/admin/user" />
						<NavItem icon={<PostIcon />} to="/admin/place" />
						<NavItem icon={<ChatIcon />} to="/admin/chat" />
						<NavItem icon={<BellIcon />} to="/admin/notification" />
					</>
				)}
				<NavItem icon={<CaretIcon />}>
					<DropdownMenu>
						<DropdownItem icon={<LogoutIcon />} action={auth.logout}>
							Logout
						</DropdownItem>
					</DropdownMenu>
				</NavItem>
			</Navbar>
		</div>
	);
};

export default Navigation;
