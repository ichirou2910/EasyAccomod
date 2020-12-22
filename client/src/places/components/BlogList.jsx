import React, { useState, useEffect } from 'react';

import BlogItem from './BlogItem';
import Button from '../../shared/components/FormElements/Button';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './BlogList.css';

const itemsPerPage = 5;

const BlogList = (props) => {
	const [blogs, setBlogs] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (props.blogs) {
			setBlogs(
				props.blogs.slice(
					page * itemsPerPage,
					Math.min(props.blogs.length, page * itemsPerPage + itemsPerPage)
				)
			);
		}
	}, [props.blogs, page]);

	const pageInc = () => {
		if (page < props.blogs.length / itemsPerPage - 1)
			setPage((page) => page + 1);
	};

	const pageDec = () => {
		if (page > 0) setPage((page) => page - 1);
	};

	return (
		<div className="blog-list">
			<div className="blog-list__header">
				<h2>Latest Blogs</h2>
			</div>
			{!props.blogs || props.blogs.length === 0 ? (
				<p className="blog-list__empty">No blog written yet</p>
			) : (
				<>
					<div className="activity-list__navi">
						<Button onClick={pageDec}>
							<FaChevronLeft />
						</Button>
						<p>
							Page {page + 1}/{Math.ceil(props.blogs.length / 10)}
						</p>
						<Button onClick={pageInc}>
							<FaChevronRight />
						</Button>
					</div>
					<ul className="blog-list__content">
						{blogs.map((blog, index) => (
							<BlogItem
								key={index}
								id={blog._id}
								user={blog.user}
								title={blog.title}
								cover={blog.cover}
								content={blog.content}
								date={blog.displayDate}
							/>
						))}
					</ul>
				</>
			)}
		</div>
	);
};

export default BlogList;
