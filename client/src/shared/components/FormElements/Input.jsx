import React, { useReducer, useEffect, useContext } from 'react';
import { validate } from '../../util/validators';
import { AuthContext } from '../../context/auth-context';

import './Input.css';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE': {
			return {
				...state,
				value: action.value,
				isValid: validate(action.value, action.validators),
			};
		}
		case 'TOUCH': {
			return {
				...state,
				isTouched: true,
			};
		}
		case 'RESET': {
			return {
				...state,
				value: '',
				isValid: false,
				isTouched: false,
			};
		}
		default:
			return state;
	}
};

const Input = (props) => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initialValue || '',
		isTouched: false,
		isValid: props.initialValid || false,
	});

	const { id, onInput, submitted, onSubmit } = props;
	const { value, isValid } = inputState;

	const auth = useContext(AuthContext);

	// Reset input field on submission if necessary
	useEffect(() => {
		if (submitted) {
			dispatch({
				type: 'RESET',
			});
			onSubmit();
		}
	}, [submitted, onSubmit]);

	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, value, isValid, onInput]);

	const changeHandler = (event) => {
		dispatch({
			type: 'CHANGE',
			value: event.target.value,
			validators: props.validators,
		});
	};

	const touchHandler = () => {
		dispatch({
			type: 'TOUCH',
		});
	};

	const pasteHandler = async (event) => {
		let file = event.clipboardData.files[0];
		if (file) {
			event.persist();

			let data = new FormData();
			data.append('user', auth.loginInfo.name);
			data.append('image', file);

			fetch(`${process.env.REACT_APP_API_URL}/image/upload`, {
				method: 'POST',
				body: data,
				headers: {
					Authorization: 'Bearer ' + auth.token,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					let path = `${process.env.REACT_APP_HOST_URL}/${res.path}`;
					let imageId = res._id;
					let insertText = `![${imageId}](${path})`;
					let curPos = event.target.selectionStart;
					let textBeforeCurPos = inputState.value.slice(0, curPos);
					let textAfterCurPos = inputState.value.substring(
						curPos,
						inputState.value.length
					);
					dispatch({
						type: 'CHANGE',
						value: textBeforeCurPos + insertText + textAfterCurPos,
						validators: props.validators,
					});
				})
				.catch((err) => console.log(err));
		}
	};

	const element =
		props.element === 'input' ? (
			<input
				id={props.id}
				type={props.type}
				placeholder={props.placeholder}
				onChange={changeHandler}
				onBlur={props.onBlur || touchHandler}
				value={inputState.value}
				style={props.style}
				spellCheck={false}
				disabled={props.disabled}
			/>
		) : (
			<textarea
				id={props.id}
				rows={props.rows || 5}
				onChange={changeHandler}
				onBlur={props.onBlur || touchHandler}
				value={inputState.value}
				style={props.style}
				spellCheck={false}
				onPaste={props.onPaste || pasteHandler}
			/>
		);

	return (
		<div
			className={`form-control ${
				!inputState.isValid && inputState.isTouched && 'form-control--invalid'
			}`}
		>
			{props.label && (
				<label htmlFor={props.id}>
					<span>{props.label}</span>
				</label>
			)}
			{element}
			{!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
		</div>
	);
};

export default Input;
