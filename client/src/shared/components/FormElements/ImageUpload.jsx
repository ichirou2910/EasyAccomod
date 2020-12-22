import React, { useState, useRef, useEffect } from 'react';

import Button from '../FormElements/Button';

import './ImageUpload.css';

const ImageUpload = (props) => {
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState(props.initialValue || null);
	const [isValid, setIsValid] = useState(props.initialValid || false);

	const filePickerRef = useRef();

	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	const pickedHandler = (event) => {
		let pickedFile;
		let fileIsValid = isValid;
		if (event.target.files && event.target.files.length === 1) {
			pickedFile = event.target.files[0];
			setFile(pickedFile);
			setIsValid(true);
			fileIsValid = true;
		} else {
			fileIsValid = false;
			setIsValid(false);
		}
		props.onInput(props.id, pickedFile, fileIsValid);
	};

	const pickImageHandler = () => {
		filePickerRef.current.click();
	};
	return (
		<div className="form-control">
			<input
				type="file"
				id={props.id}
				ref={filePickerRef}
				style={{ display: 'none' }}
				accept=".jpg,.png,.jpeg"
				onChange={pickedHandler}
			/>
			<div className="image-upload center">
				<div
					className={`image-upload__preview image-upload__preview--${
						props.square ? 'square' : 'wide'
					}`}
				>
					{previewUrl && <img src={previewUrl} alt="Preview" />}
					{!previewUrl && <p>{props.description || 'Please pick an image'}</p>}
				</div>
				<div className="image-upload--center">
					<Button type="button" onClick={pickImageHandler}>
						{props.description}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ImageUpload;
