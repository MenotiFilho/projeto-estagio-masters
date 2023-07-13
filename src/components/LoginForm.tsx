import { auth, signInWithEmailAndPassword } from '../firebase';
import { useState } from 'react';
import { EyeClosed, Eye } from '@phosphor-icons/react';

interface LoginFormProps {
	onLoginSuccess: (displayName: string) => void;
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const onLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage('');

		if (!validateEmail(email)) {
			setErrorMessage('Formato de email inválido');
			return;
		}

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				const displayName = user.displayName ?? '';
				onLoginSuccess(displayName);
			})
			.catch((error) => {
				if (
					error.message === 'Firebase: Error (auth/wrong-password).' ||
					error.message === 'Firebase: Error (auth/user-not-found).'
				) {
					setErrorMessage('Email ou senha incorretos');
				} else {
					setErrorMessage(error.message);
				}
			});
	};

	return (
		<div className="w-full flex flex-col">
			<form>
				<div>
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
					<div className="flex rounded-md mt-2 focus-within:ring-2 focus-within:ring-blue-500/70 focus-within:border-transparent">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							placeholder="Senha"
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-gray-200 rounded-l-md border-r-0 focus:outline-none focus:ring-0 focus:border-transparent text-black"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className=" rounded-md rounded-l-none bg-white flex items-center  "
						>
							{showPassword ? (
								<Eye className="mr-3" size={26} color="black" weight="light" />
							) : (
								<EyeClosed
									className="mr-3"
									size={26}
									color="black"
									weight="light"
								/>
							)}
						</button>
					</div>
				</div>
				<button
					onClick={onLogin}
					type="submit"
					className="mt-4 px-3 py-1 relative rounded group font-md text-white font-md inline-block"
				>
					<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
					<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
					<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
					<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
					<span className="relative">Login</span>
				</button>
			</form>
			{errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
		</div>
	);
}

export default LoginForm;
