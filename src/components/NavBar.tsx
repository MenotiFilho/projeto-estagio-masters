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
import { Separator } from './ui/separator';

const NavBar = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [showLoginDialog, setShowLoginDialog] = useState(false);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

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
		<div className="sticky top-0 bg-[#0F172A] text-[#e2e8f0] z-10">
			<div className="flex justify-center">
				<div className="flex  items-center my-2 justify-between mx-2 w-full max-w-7xl">
					<div
						className="self-center flex items-center justify-start cursor-pointer "
						onClick={scrollToTop}
					>
						<div className="absolute">
							<GameController size={50} color="#9333ea" weight="duotone" />
						</div>
						<div>
							<GameController size={50} color="#3b82f6 " weight="fill" />
						</div>
						<h1 className=" ml-3 leading-4 flex-nowrap w-fit text-center text-sm font-extralight font-mono">
							Game <br /> Vault
						</h1>
					</div>
					{loggedIn ? (
						<div className="flex flex-col justify-center items-center gap-1">
							<span className="text-white text-xs lg:text-base">
								Olá, {username ? <span>{username}</span> : <span>{email}</span>}
							</span>
							<button
								onClick={handleLogout}
								type="submit"
								className="relative rounded group text-white inline-block w-full"
							>
								<span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
								<span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
								<span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
								<span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
								<span className="relative text-xs lg:text-base">Sair</span>
							</button>
						</div>
					) : (
						<div className="flex flex-col gap-1">
							<div className="flex items-center justify-center gap-2">
								<Dialog>
									<DialogTrigger>
										<span className="relative rounded group text-white text-sm lg:text-sm p-1 inline-block w-full">
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
										<span className="relative rounded group text-white text-sm lg:text-sm inline-block w-full p-1">
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
								<DialogTrigger className="h-fit -mt-1 lg:-m-1.5">
									<span className="opacity-60 hover:opacity-100 text-xs lg:text-xs">
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
			<Separator />
		</div>
	);
};

export default NavBar;
