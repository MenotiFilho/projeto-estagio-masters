/* eslint-disable @typescript-eslint/no-unused-vars */
import LoginForm from './LoginForm';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import SignUpForm from './SignUpForm';
import { useEffect, useState } from 'react';
import { auth, signOut } from '@/firebase';
import ResetPasswordForm from './PasswordForm';
import { onAuthStateChanged } from 'firebase/auth';
import { GameController } from '@phosphor-icons/react';

const NavBar = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [showLoginDialog, setShowLoginDialog] = useState(false); // State for dialog visibility

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (user.displayName) {
					setUsername(user.displayName);
				}
				if (user.email) {
					setEmail(user.email);
				}
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
				setEmail('');
				console.log(email);
				setUsername('');
			}
		});

		return () => unsubscribe();
	}, [email]);

	const handleLoginSuccess = () => {
		setLoggedIn(true);
		setShowLoginDialog(false);
		console.log(showLoginDialog);
	};

	const handleSignUpSuccess = () => {
		setLoggedIn(true);
		setShowLoginDialog(false);
	};

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				setLoggedIn(false);
				setEmail('');
				setUsername('');
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className="sticky w-full flex items-center justify-center border-b border-slate-500/50 h-20">
			<div className="flex my-2 justify-between mx-2 w-full max-w-7xl">
				<div className="self-center flex items-center justify-start ">
					<div className="absolute">
						<GameController size={50} color="#9333ea" weight="regular" />
					</div>
					<div>
						<GameController size={50} color="#3b82f6 " weight="fill" />
					</div>
					<h1 className=" ml- cursor-default flex-nowrap w-20 text-center text-sm font-extralight font-mono">
						Projeto de Estágio
					</h1>
				</div>
				{loggedIn ? (
					<div className="flex  items-center justify-center gap-1">
						<span className="text-white mr-4">
							Olá, {username ? <span>{username}</span> : <span>{email}</span>}
						</span>
						<button
							onClick={handleLogout}
							type="submit"
							className=" px-3 py-1 relative rounded group font-md text-white font-md inline-block"
						>
							<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
							<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
							<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
							<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
							<span className="relative">Sair</span>
						</button>
					</div>
				) : (
					<div className="flex flex-col gap-1">
						<div className="flex gap-2">
							<Dialog>
								<DialogTrigger>
									<span className="py-1 px-2 relative rounded group font-md text-white font-md inline-block">
										<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
										<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
										<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
										<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
										<span className="relative">Login</span>
									</span>
								</DialogTrigger>
								<DialogContent className="">
									<DialogHeader>
										<DialogTitle className="text-white">Login</DialogTitle>
										<DialogDescription></DialogDescription>
									</DialogHeader>
									<LoginForm onLoginSuccess={handleLoginSuccess} />
								</DialogContent>
							</Dialog>

							<Dialog>
								<DialogTrigger>
									<span className="py-1 px-2 relative rounded group font-md text-white font-md inline-block">
										<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
										<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
										<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
										<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
										<span className="relative">Criar Conta</span>
									</span>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="text-white">
											Crie sua conta
										</DialogTitle>
									</DialogHeader>
									<SignUpForm onSignUpSuccess={handleSignUpSuccess} />
								</DialogContent>
							</Dialog>
						</div>
						<Dialog>
							<DialogTrigger>
								<span className="opacity-60 hover:opacity-100">
									Esqueci minha senha
								</span>
							</DialogTrigger>
							<DialogContent className="">
								<DialogHeader>
									<DialogTitle className="text-white">
										Recuperação de senha
									</DialogTitle>
									<DialogDescription></DialogDescription>
								</DialogHeader>
								<ResetPasswordForm />
							</DialogContent>
						</Dialog>
					</div>
				)}
			</div>
		</div>
	);
};

export default NavBar;
