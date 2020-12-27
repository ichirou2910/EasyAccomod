import React, { useState } from 'react';

import './Tab.css';

const TabItem = (props) => {
	TabItem.name = 'TabItem';
	return <div {...props} />;
};

const Tabs = (props) => {
	const [bindIndex, setBindIndex] = useState(props.defaultIndex);
	const changeTab = (newIndex) => {
		if (typeof props.onTabClick === 'function') props.onTabClick(newIndex);
		setBindIndex(newIndex);
	};

	return (
		<>
			<div className="tab-menu">
				{props.children
					.filter((props) => props.type.name === TabItem.name)
					.map(({ props: { index, label } }) => (
						<button
							type="button"
							key={index}
							onClick={() => changeTab(index)}
							className={bindIndex === index ? 'focus' : ''}
						>
							<p className="tab-menu__label">{label}</p>
						</button>
					))}
			</div>
			<div className="tab-view">
				{props.children.map(({ props }) => (
					<div
						{...props}
						className="tab-view_item"
						key={props.index}
						style={{
							display: bindIndex === props.index ? 'block' : 'none',
						}}
					/>
				))}
			</div>
		</>
	);
};

export { TabItem, Tabs };
