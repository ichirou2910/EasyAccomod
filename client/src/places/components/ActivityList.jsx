import React, { useState, useEffect } from 'react';

import ActivityItem from './ActivityItem';
import Button from '../../shared/components/FormElements/Button';

import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import './ActivityList.css';

const itemsPerPage = 10;

const ActivityList = (props) => {
	const [acts, setActs] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (props.activities) {
			setActs(
				props.activities.slice(
					page * itemsPerPage,
					Math.min(props.activities.length, page * itemsPerPage + itemsPerPage)
				)
			);
		}
	}, [props.activities, page]);

	const pageInc = () => {
		if (page < props.activities.length / itemsPerPage - 1)
			setPage((page) => page + 1);
	};

	const pageDec = () => {
		if (page > 0) setPage((page) => page - 1);
	};

	return (
		<div className="activity-list">
			<div className="activity-list__header">
				<h2>Activities</h2>
			</div>
			{!props.activities || props.activities.length === 0 ? (
				<p className="activity-list__empty">No activity so far</p>
			) : (
				<>
					<div className="activity-list__navi">
						<Button onClick={pageDec}>
							<FaChevronLeft />
						</Button>
						<p>
							Page {page + 1}/{Math.ceil(props.activities.length / 10)}
						</p>
						<Button onClick={pageInc}>
							<FaChevronRight />
						</Button>
					</div>
					<ul className="activity-list__content">
						{acts.map((item, index) => {
							return (
								<ActivityItem
									key={index}
									user={item.user}
									blogId={item.blogId}
									action={item.type === 'comment' ? 'commented on' : 'posted'}
									actionId={item.actionId || null}
									title={item.title}
								/>
							);
						})}
					</ul>
				</>
			)}
		</div>
	);
};

export default ActivityList;
