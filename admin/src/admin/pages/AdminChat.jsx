import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { socket } from '../../App';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { FaUser } from 'react-icons/fa';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';

import './AdminChat.css';

const AdminChat = () => {
	const [messages, setMessages] = useState([]);
	const [userList, setUserList] = useState([]);
	const [activeId, setActiveId] = useState();

	const [showList, setShowList] = useState(true);

	const [formState, inputHandler] = useForm(
		{
			message: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const { isLoading, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const submitHandler = (e) => {
		e.preventDefault();
		// console.log(formState.inputs.message.value);
		if (activeId) {
			const newMsg = {
				user_type: auth.loginInfo.user_type,
				owner_id: activeId,
				content: formState.inputs.message.value,
			};
			socket.emit('fromClient', newMsg);
		}
	};

	useEffect(() => {
		socket.on('toClient', (data) => {
			if (data.owner_id === activeId) setMessages([data, ...messages]);
		});
		return () => {
			socket.off('toClient');
		};
	});

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const infoData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setUserList(infoData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	const switchHandler = async (id) => {
		try {
			const infoData = await sendRequest(
				`${process.env.REACT_APP_API_URL}/chat/${id}`,
				'GET',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			setMessages(infoData);
			setActiveId(id);
		} catch (err) {}
	};

	return (
		<>
			<Helmet>
				<title>{`EasyAccomod - Chat`}</title>
			</Helmet>
			<div className="admin-chat">
				{!showList && (
					<div className="chat__list-open">
						<Button onClick={() => setShowList(true)}>
							<FaUser />
						</Button>
					</div>
				)}
				{showList && (
					<div className="chat__list">
						<span
							className="chat__list-close"
							onClick={() => setShowList(false)}
						></span>
						{!isLoading && userList && (
							<ul>
								{userList.map((item, index) => {
									return (
										<li key={index} onClick={() => switchHandler(item.id)}>
											{item.realname}
										</li>
									);
								})}
							</ul>
						)}
					</div>
				)}
				<div className="chat__room">
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
					<div className="chat__messages">
						{!isLoading && messages && (
							<ul>
								{messages.map((item, index) => {
									return (
										<li
											key={index}
											className={`message ${
												item.user_type === 'Owner' && 'message--right'
											}`}
										>
											<span>{item.content}</span>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminChat;
