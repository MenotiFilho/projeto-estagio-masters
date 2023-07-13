import { useState } from 'react';
import {
	auth,
	createUserWithEmailAndPassword,
	updateProfile,
} from '../firebase';
import { EyeClosed, Eye } from '@phosphor-icons/react';

interface SignUpFormProps {
	onSignUpSuccess: (displayName: string) => void;
}

function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<string[]>([]);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const onSignUp = (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: string[] = [];

		if (password !== confirmPassword) {
			newErrors.push('As senhas estão diferentes');
		}

		if (!validateEmail(email)) {
			newErrors.push('Formato de email inválido');
		}

		if (password.length < 5) {
			newErrors.push('A senha deve ter no mínimo 5 caracteres');
		}

		if (username.length < 2) {
			newErrors.push('O nome de usuário deve ter no mínimo 2 caracteres');
		}

		if (newErrors.length > 0) {
			setErrors(newErrors);
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;

				const displayName = username;
				updateProfile(user, {
					displayName: displayName,
				})
					.then(() => {
						onSignUpSuccess(displayName);
					})
					.catch((error) => {
						console.error(error);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				setErrors([errorMessage]);
			});
	};

	return (
		<div className="w-full flex flex-col">
			<form>
				<div>
					<label htmlFor="username" className="block text-gray-200">
						Nome de usuário
					</label>
					<input
						type="text"
						id="username"
						name="username"
						onChange={(e) => setUsername(e.target.value)}
						className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent text-black"
						placeholder="Digite seu nome de usuário"
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
						Senha
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
							tabIndex={-1}
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="rounded-md rounded-l-none bg-white flex items-center"
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
				<div className="mt-4">
					<label htmlFor="confirm-password" className="block text-gray-200">
						Confirme sua senha
					</label>
					<div className="flex mt-2 rounded-md focus-within:ring-2 focus-within:ring-blue-500/70 focus-within:border-transparent">
						<input
							id="confirm-password"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							required
							placeholder="Confirme sua senha"
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full px-4 py-2 focus:outline-none focus:ring-0 border border-gray-200 rounded-l-md border-r-0 focus:border-transparent text-black"
						/>
						<button
							tabIndex={-1}
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="rounded-md rounded-l-none bg-white flex items-center"
						>
							{showConfirmPassword ? (
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
				{errors.length > 0 && (
					<ul className="text-red-500 mt-2">
						{errors.map((error) => (
							<li key={error}>{error}</li>
						))}
					</ul>
				)}
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
		</div>
	);
}

export default SignUpForm;
