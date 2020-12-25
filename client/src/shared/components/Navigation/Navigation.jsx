import React, { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';
import { Navbar, NavItem, DropdownMenu, DropdownItem } from './Navbar';
// import DropdownMenu from './DropdownMenu';

import { ReactComponent as PlusIcon } from '../../../icons/plus.svg';
import { ReactComponent as ChatIcon } from '../../../icons/chat.svg';
import { ReactComponent as BellIcon } from '../../../icons/bell.svg';
import { ReactComponent as CaretIcon } from '../../../icons/caret.svg';
import { ReactComponent as UserIcon } from '../../../icons/user.svg';
import { ReactComponent as PostIcon } from '../../../icons/post.svg';
import { ReactComponent as CogIcon } from '../../../icons/cog.svg';
import { ReactComponent as LogoutIcon } from '../../../icons/logout.svg';
import { ReactComponent as SearchIcon } from '../../../icons/search.svg';

import './Navigation.css';

const Navigation = () => {
	const auth = useContext(AuthContext);
	return (
		<div className="navigation">
			<Navbar>
				{auth.isLoggedIn && (
					<>
						{auth.loginInfo.user_type === 'Owner' && (
							<>
								<NavItem icon={<PlusIcon />} to="/place/create" />
								<NavItem icon={<ChatIcon />} />
							</>
						)}
						<NavItem icon={<BellIcon />} />
						{auth.loginInfo.user_type === 'Renter' && (
							<NavItem icon={<SearchIcon />} to="/search" />
						)}
					</>
				)}
				<NavItem icon={<CaretIcon />}>
					<DropdownMenu>
						{!auth.isLoggedIn && (
							<DropdownItem icon={<UserIcon />} to="/auth">
								Login
							</DropdownItem>
						)}
						{auth.isLoggedIn && (
							<>
								<DropdownItem icon={<UserIcon />} to="/profile">
									My Profile
								</DropdownItem>
								<DropdownItem icon={<PostIcon />} to="/profile/place">
									{auth.loginInfo.user_type === 'Owner'
										? 'My Places'
										: 'Favorites'}
								</DropdownItem>
								{/* <DropdownItem icon={<CogIcon />}>Settings</DropdownItem> */}
								<DropdownItem icon={<LogoutIcon />} action={auth.logout}>
									Logout
								</DropdownItem>
							</>
						)}
					</DropdownMenu>
				</NavItem>
			</Navbar>
		</div>
	);
};

export default Navigation;
