import React, { useContext } from 'react';
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
	const { isLoading, error, sendRequest } = useHttpClient();

	const [formState, inputHandler] = useForm(
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
	};

	return (
		<>
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
				<form onSubmit={authSubmitHandler}>
					<Input
						element="input"
						id="email"
						type="email"
						label="Email"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
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
						onInput={inputHandler}
					/>
					<p>{error}</p>
					<Button type="submit" disabled={!formState.isValid}>
						LOGIN
					</Button>
				</form>
			</Card>
		</>
	);
};

export default Auth;
