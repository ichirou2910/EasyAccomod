import React from 'react';

import { Tabs, TabItem } from '../UIElements/Tab';
import Input from './Input';

import './Editor.css';
import '../../../places/pages/PlaceForm.css';

const blogPreviewStyle = {
	width: '100%',
	border: '2px solid var(--dark-primary-color)',
	margin: 0,
};

const previewContentStyle = {
	height: '70vh',
	borderRadius: 0,
	overflowY: 'scroll',
};

const Editor = (props) => {
	return (
		<>
			<Tabs defaultIndex="1">
				<TabItem label="Content" index="1">
					<Input
						id={props.id}
						element="textarea"
						validators={props.validators}
						errorText={props.errorText}
						onInput={props.onInput}
						initialValue={props.editValue}
						initialValid={props.editValid}
					/>
				</TabItem>
				<TabItem label="Preview" index="2"></TabItem>
			</Tabs>
		</>
	);
};

export default Editor;
