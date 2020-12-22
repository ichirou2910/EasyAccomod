import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Cover from '../../shared/components/UIElements/Cover';
import BlogPreview from '../components/BlogPreview';
import CommentList from '../components/CommentList';
import StickyIcon from '../../shared/components/UIElements/StickyIcon';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlacePage.css';

const PlacePage = () => {
	const [blog, setBlog] = useState();
	const [comments, setComments] = useState();

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);
	const blogId = useParams().blogId;

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const blogData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/blog/${blogId}`
				);
				setBlog(blogData);
			} catch (err) {
				console.log(err);
			}

			try {
				const commentData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/comment/blog/${blogId}`
				);
				setComments(commentData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, blogId]);

	return (
		<>
			{blog && (
				<Helmet>
					<title>{`Bloggit - ${blog.title}`}</title>
				</Helmet>
			)}
			<div className="blog-page">
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				{!isLoading &&
					auth.isLoggedIn &&
					blog &&
					auth.loginInfo.name === blog.user && (
						<StickyIcon
							src={`${process.env.REACT_APP_HOST_URL}/uploads/images/edit-blog.png`}
							alt="edit profile icon"
							to={`/blog/${blog._id}/edit`}
							text="Edit Blog"
						/>
					)}
				{!isLoading && blog && comments && (
					<>
						<Cover
							image={`${process.env.REACT_APP_HOST_URL}/${blog.cover}`}
							alt={`${blog.title}'s Cover`}
						/>

						<div className="blog-page__content-section base-view">
							<div className="blog-page__header">
								<h2>{blog.title}</h2>
								<p>
									- by{' '}
									<Link to={`/user/${blog.user}`}>
										<em>{blog.user}</em>
									</Link>
								</p>
								<p>Last modified: {blog.displayDate}</p>
							</div>
							<BlogPreview text={blog.content} />
						</div>
						<CommentList blogId={blogId} comments={comments} />
					</>
				)}
			</div>
		</>
	);
};

export default PlacePage;
