import React from 'react';

import PlaceList from './PlaceList';
import ActivityList from './ActivityList';

import './ContentFeeds.css';

const ContentFeeds = (props) => {
	return (
		<div className="content-feeds">
			<PlaceList places={props.places} />
			<ActivityList activities={props.activities} />
		</div>
	);
};

export default ContentFeeds;
