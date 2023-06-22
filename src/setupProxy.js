import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'https://games-test-api-81e9fb0d564a.herokuapp.com',
			changeOrigin: true,
		})
	);
}
