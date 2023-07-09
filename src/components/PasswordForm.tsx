import { useState } from 'react';
import { auth, sendPasswordResetEmail } from '../firebase';

function ResetPasswordForm() {
	const [email, setEmail] = useState('');
	const [isEmailSent, setIsEmailSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleResetPassword = (e) => {
		e.preventDefault();
		setErrorMessage('');

		sendPasswordResetEmail(auth, email)
			.then(() => {
				setIsEmailSent(true);
			})
			.catch((error) => {
				setErrorMessage(error.message);
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
				{isEmailSent ? (
					<p className="text-green-500 mt-2">
						Um email com as intruções para redefenir sua senha foi enviado ao
						seu endereço de email.
					</p>
				) : (
					<button
						onClick={handleResetPassword}
						type="submit"
						className="mt-4 px-3 py-1 relative rounded group font-md text-white font-md inline-block"
					>
						<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
						<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
						<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
						<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
						<span className="relative">Reset Password</span>
					</button>
				)}
				{errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
			</form>
		</div>
	);
}

export default ResetPasswordForm;
