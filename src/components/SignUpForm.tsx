import { useState } from 'react';
import {
	auth,
	createUserWithEmailAndPassword,
	updateProfile,
} from '../firebase';

interface SignUpFormProps {
	onSignUpSuccess: (displayName: string) => void;
}

function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const onSignUp = (e: React.FormEvent) => {
		e.preventDefault();
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log(user);

				const displayName = user.displayName ?? ''; // Verificação de nulidade
				updateProfile(user, {
					displayName: username,
				});
				console.log(username);
				onSignUpSuccess(displayName);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				setErrorMessage(error.message);
			});
	};

	return (
		<div className="w-full flex flex-col">
			<form>
				<div>
					<label htmlFor="username" className="block text-gray-200">
						Username
					</label>
					<input
						type="text"
						id="username"
						name="username"
						onChange={(e) => setUsername(e.target.value)}
						className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
						placeholder="Enter your username"
						required
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="email-address" className="block text-gray-200">
						Email
					</label>
					<input
						type="email"
						id="email-address"
						name="email"
						onChange={(e) => setEmail(e.target.value)}
						className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
						placeholder="Enter your email"
						required
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="password" className="block text-gray-200">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						className="w-full mt-2 px-4 py-2 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
					/>
				</div>
				<button
					onClick={onSignUp}
					type="submit"
					className="mt-4 px-3 py-1 relative rounded group font-md text-white font-md inline-block"
				>
					<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
					<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
					<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
					<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
					<span className="relative">Sign Up</span>
				</button>
			</form>
			{errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
		</div>
	);
}

export default SignUpForm;
