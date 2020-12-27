import React from 'react';
import { Link } from 'react-router-dom';

import './Bloggit.css';

const Bloggit = () => {
	return (
		<Link to="/blog/create">
			<div className="bloggit">
				<img
					src={`${process.env.REACT_APP_HOST_URL}/uploads/images/create-blog.png`}
					alt="create blog icon"
				/>
			</div>
		</Link>
	);
};
export default Bloggit;
