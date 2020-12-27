import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './DropdownMenu.css';

const DropdownMenu = (props) => {
	const DropdownItem = (props) => {
		return (
			<a href="#" className="dropdown__item">
				{props.children}
			</a>
		);
	};

	const content = (
		<CSSTransition
			in={props.show}
			timeout={200}
			classNames="slide-in-top"
			mountOnEnter
			unmountOnExit
		>
			<aside className="dropdown-drawer" onClick={props.onClick}>
				{props.children}
			</aside>
		</CSSTransition>
	);
	return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default DropdownMenu;
