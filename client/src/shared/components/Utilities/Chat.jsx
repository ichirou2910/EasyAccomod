import React, { useState, useContext, useEffect } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import { useForm } from '../../hooks/form-hook';
import { socket } from '../../../App';

import Input from '../FormElements/Input';
import Button from '../FormElements/Button';

import './Chat.css';

const Message = (props) => {
	return (
		<li
			className={`message ${
				props.msg.user_type === 'Owner' && 'message--right'
			}`}
		>
			<span>{props.msg.content}</span>
		</li>
	);
};

const Chat = () => {
	const [messages, setMessages] = useState([]);

	const [formState, inputHandler] = useForm(
		{
			message: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const submitHandler = (e) => {
		e.preventDefault();
		// console.log(formState.inputs.message.value);
		const newMsg = {
			user_type: auth.loginInfo.user_type,
			owner_id: auth.loginInfo.user_id,
			content: formState.inputs.message.value,
		};
		socket.emit('fromClient', newMsg);
		const newNoti = {
			user_id: auth.loginInfo.user_id,
			description: formState.inputs.message.value,
		};
		socket.emit('notification', newNoti);
	};

	useEffect(() => {
		socket.on('toClient', (data) => {
			setMessages(messages.concat(data));
		});
		return () => {
			socket.off('toClient');
		};
	});

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const infoData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/chat/${auth.loginInfo.user_id}`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setMessages(infoData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	return (
		<div className="chat">
			<h2>Messages</h2>
			<div className="chat__messages">
				{!isLoading && messages && (
					<ul>
						{messages.map((item, index) => {
							return <Message key={index} msg={item} />;
						})}
					</ul>
				)}
			</div>
			<div className="chat__input">
				<form onSubmit={submitHandler}>
					<Input
						id="message"
						element="input"
						type="text"
						validators={[]}
						onInput={inputHandler}
					/>
					<Button type="submit">SEND</Button>
				</form>
			</div>
		</div>
	);
};

export default Chat;
