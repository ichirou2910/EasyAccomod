import React from 'react';

import './BlogPreview.css';

const marked = require('marked');
marked.setOptions({
	breaks: true,
});

const renderer = new marked.Renderer();

const renderMarkdown = (text) => {
	return {
		__html: marked(text, {
			renderer: renderer,
		}),
	};
};

const BlogPreview = (props) => {
	return (
		<div className="blog-preview" style={props.blogPreviewStyle}>
			<label
				htmlFor="preview-content"
				style={props.preview ? {} : { display: 'none' }}
			>
				Preview
			</label>
			<div
				className="preview-content"
				dangerouslySetInnerHTML={renderMarkdown(props.text)}
				style={props.previewContentStyle}
			></div>
		</div>
	);
};

export default BlogPreview;
