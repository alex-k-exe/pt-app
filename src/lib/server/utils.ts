import type { Cookies } from '@sveltejs/kit';

export function setCookie(cookies: Cookies, name: string, value: string) {
	cookies.set(name, value, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10
	});
}
