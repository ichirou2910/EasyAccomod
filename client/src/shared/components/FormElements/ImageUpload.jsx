import React, { useState, useRef, useEffect } from 'react';

import Button from '../FormElements/Button';

import './ImageUpload.css';

const ImageUpload = (props) => {
	const [files, setFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState(props.initialValue || []);
	const [isValid, setIsValid] = useState(props.initialValid || false);

	const filePickerRef = useRef();

	// useEffect(() => {
	// 	setPreviewUrls([]);
	// 	if (props.initialValue) {
	// 		props.initialValue.map((item, index) => {
	// 			setPreviewUrls([
	// 				...previewUrls,
	// 				`${process.env.REACT_APP_HOST_URL}/${item}`,
	// 			]);
	// 		});
	// 	}
	// }, [props.initialValue]);

	useEffect(() => {
		if (!files) {
			return;
		}

		Promise.all(
			files.map((f) => {
				return new Promise((resolve, reject) => {
					const fileReader = new FileReader();
					fileReader.addEventListener('load', (ev) => {
						resolve(ev.target.result);
					});
					fileReader.addEventListener('error', reject);
					fileReader.readAsDataURL(f);
				});
			})
		).then((images) => {
			setPreviewUrls(images);
		});
		// const fileReader = new FileReader();
		// fileReader.onload = () => {
		// 	setPreviewUrls([...previewUrls, fileReader.result]);
		// };
		// files.map((item) => fileReader.readAsDataURL(item));
	}, [files]);

	const pickedHandler = (event) => {
		let pickedFile;
		let fileIsValid = isValid;
		if (event.target.files && event.target.files.length === 1) {
			pickedFile = event.target.files[0];
			setFiles([...files, pickedFile]);
			setIsValid(true);
			fileIsValid = true;
		} else {
			fileIsValid = false;
			setIsValid(false);
		}
		console.log(files.length);
		props.onInput(props.id, [...files, pickedFile], files.length + 1 >= 3);
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
				multiple
			/>
			<div className="image-upload center">
				<div className="image-upload--center">
					<Button type="button" onClick={pickImageHandler}>
						{props.description}
					</Button>
				</div>
				<div className="image-upload__preview">
					{previewUrls &&
						previewUrls.map((item, index) => {
							return (
								<div key={index} className="image-upload__preview-item">
									<img src={item} alt="Preview" />
								</div>
							);
						})}
					{/* {!previewUrls && <p>{props.description || 'Please pick an image'}</p>} */}
				</div>
			</div>
		</div>
	);
};

export default ImageUpload;
