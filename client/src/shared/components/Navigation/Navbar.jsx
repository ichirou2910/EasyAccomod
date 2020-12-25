import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {
	return (
		<nav className="navbar">
			<ul className="navbar__nav-left">
				<li className="navbar__logo">
					<Link to="/">
						<img
							src={`${process.env.REACT_APP_HOST_URL}/uploads/images/logo.png`}
							alt="EA Logo"
						/>
					</Link>
				</li>
			</ul>
			<ul className="navbar__nav">{props.children}</ul>
		</nav>
	);
};

const NavItem = (props) => {
	const [open, setOpen] = useState(false);

	return (
		<li className="navbar__item">
			{props.to ? (
				<a href={props.to} className="navbar__icon-btn">
					{props.icon}
				</a>
			) : (
				<>
					<a className="navbar__icon-btn" onClick={() => setOpen(!open)}>
						{props.icon}
					</a>
					{open && props.children}
				</>
			)}
		</li>
	);
};

const DropdownMenu = (props) => {
	return <div className="navbar__dropdown">{props.children}</div>;
};

const DropdownItem = (props) => {
	return (
		<a href={props.to} className="navbar__menu-item" onClick={props.action}>
			<span className="navbar__icon-btn">{props.icon}</span>
			{props.children}
		</a>
	);
};

export { Navbar, NavItem, DropdownMenu, DropdownItem };
