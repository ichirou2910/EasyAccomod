import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
	VALIDATOR_MAXLENGTH,
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';

import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';

import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [userMode, setUserMode] = useState('');
	const [message, setMessage] = useState('');
	const { isLoading, error, sendRequest } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const authSubmitHandler = async (event) => {
		event.preventDefault();
		setMessage('');

		if (isLoginMode) {
			try {
				const resData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user/authenticate`,
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);

				auth.login(resData.user, resData.token);
				return <Redirect to="/" />;
			} catch (err) {
				console.log(err);
			}
		} else {
			if (formState.inputs.password.value !== formState.inputs.confirm.value) {
				setMessage('Confirm password does not match');
				return;
			}
			try {
				const resData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user/register`,
					'POST',
					JSON.stringify({
						username: formState.inputs.username.value,
						password: formState.inputs.password.value,
						realname: formState.inputs.realname.value,
						identifier: formState.inputs.identifier.value,
						address: formState.inputs.address.value,
						phone: formState.inputs.phone.value,
						email: formState.inputs.email.value,
						user_type: userMode,
					}),
					{
						'Content-Type': 'application/json',
					}
				);

				auth.login(resData.user, resData.token);
				return <Redirect to="/" />;
			} catch (err) {
				console.log(err);
			}
		}
	};

	const switchModeHandler = () => {
		// Register -> Login mode
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					confirm: undefined,
					username: undefined,
					realname: undefined,
					identifier: undefined,
					address: undefined,
					phone: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
			setUserMode('');
		} else {
			// Login -> Register mode
			setFormData(
				{
					...formState.inputs,
					confirm: {
						value: '',
						isValid: false,
					},
					username: {
						value: '',
						isValid: false,
					},
					realname: {
						value: '',
						isValid: false,
					},
					identifier: {
						value: '',
						isValid: false,
					},
					address: {
						value: '',
						isValid: false,
					},
					phone: {
						value: '',
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prev) => !prev);
	};

	return (
		<>
			<Helmet>
				<title>{'Bloggit - Authenticate'}</title>
			</Helmet>
			<Card
				className="authentication card--lighter"
				style={{
					backgroundColor: 'transparent',
					margin: '2rem',
					boxShadow: 'none',
					overflow: 'overlay',
				}}
			>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>JOIN US</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{(isLoginMode || userMode !== '') && (
						<>
							<Input
								element="input"
								id="email"
								type="email"
								label="Email"
								validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
								errorText="Username must be more than 3 characters"
								onInput={inputHandler}
							/>
							<Input
								element="input"
								id="password"
								type="password"
								label="Password"
								validators={[
									VALIDATOR_REQUIRE(),
									VALIDATOR_MINLENGTH(8),
									VALIDATOR_MAXLENGTH(25),
								]}
								errorText="Password must be between 8-25 characters"
								onInput={inputHandler}
							/>
						</>
					)}
					{!isLoginMode && userMode === '' && (
						<>
							<Button onClick={() => setUserMode('Owner')}>
								Register as Owner
							</Button>
							<br />
							<br />
							<br />
							<Button onClick={() => setUserMode('Renter')}>
								Register as Renter
							</Button>
						</>
					)}
					{!isLoginMode && userMode !== '' && (
						<>
							<Input
								element="input"
								id="confirm"
								type="password"
								label="Confirm Password"
								validators={[
									VALIDATOR_REQUIRE(),
									VALIDATOR_MINLENGTH(8),
									VALIDATOR_MAXLENGTH(25),
								]}
								errorText="You must re-enter Password"
								onInput={inputHandler}
							/>
							<Input
								element="input"
								id="username"
								type="text"
								label="Username"
								validators={[VALIDATOR_REQUIRE()]}
								onInput={inputHandler}
							/>
							<Input
								element="input"
								id="realname"
								type="text"
								label="Real Name"
								validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
								onInput={inputHandler}
							/>
							<Input
								element="input"
								id="identifier"
								type="text"
								label="Citizen Identifier"
								validators={[VALIDATOR_REQUIRE()]}
								// errorText="You must re-enter Password"
								onInput={inputHandler}
							/>
							<Input
								element="input"
								id="address"
								type="text"
								label="Address"
								validators={[VALIDATOR_REQUIRE()]}
								onInput={inputHandler}
							/>
							<Input
								element="input"
								id="phone"
								type="text"
								label="Phone No."
								validators={[VALIDATOR_REQUIRE()]}
								onInput={inputHandler}
							/>
							<Button
								type="button"
								onClick={() =>
									userMode === 'Renter'
										? setUserMode('Owner')
										: setUserMode('Renter')
								}
							>
								{userMode === 'Owner'
									? 'Registering as Owner'
									: 'Registering as Renter'}
							</Button>
						</>
					)}
					<p>{error}</p>
					<p>{message}</p>
					{(isLoginMode || userMode !== '') && (
						<Button type="submit" disabled={!formState.isValid}>
							{isLoginMode ? 'LOGIN' : 'REGISTER'}
						</Button>
					)}
				</form>
				<Button inverse onClick={switchModeHandler}>
					{isLoginMode ? 'REGISTER' : 'LOGIN'}
				</Button>
			</Card>
		</>
	);
};

export default Auth;
