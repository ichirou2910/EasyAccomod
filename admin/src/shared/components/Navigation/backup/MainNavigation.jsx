import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import Navigation from './Navigation';
import DropdownDrawer from './DropdownDrawer';
import Backdrop from '../UIElements/Backdrop';

import './MainNavigation.css';

const MainNavigation = () => {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	const openDrawerHandler = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawerHandler = () => {
		setDrawerIsOpen(false);
	};

	return (
		<>
			{drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
			<DropdownDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
				<nav className="main-navigation__drawer-nav">
					<Navigation />
				</nav>
			</DropdownDrawer>
			<MainHeader>
				<div>
					<Link to="/">
						<img
							src={`${process.env.REACT_APP_HOST_URL}/uploads/images/logo.png`}
							alt="Bloggit Logo"
							className="main-navigation__logo"
						/>
					</Link>
				</div>
				<button
					className="main-navigation__menu-btn"
					onClick={openDrawerHandler}
				>
					<span />
					<span />
					<span />
				</button>
				<nav className="main-navigation__header-nav">
					<Navigation />
				</nav>
			</MainHeader>
		</>
	);
};

export default MainNavigation;
