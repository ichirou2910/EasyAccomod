import React from 'react';

import BlogList from './BlogList';
import ActivityList from './ActivityList';

import './ContentFeeds.css';

const ContentFeeds = (props) => {
	return (
		<div className="content-feeds">
			<BlogList blogs={props.blogs} />
			<ActivityList activities={props.activities} />
		</div>
	);
};

export default ContentFeeds;
