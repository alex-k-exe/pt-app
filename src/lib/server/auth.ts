import type { Cookies } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import wretch from 'wretch';
import type { User } from '../drizzleTables';

export function getAuthVariables(url: URL, cookies: Cookies) {
	const variables = {
		state: url.searchParams.get('state'),
		stateCookie: cookies.get('google_oauth_state'),
		codeVerifier: url.searchParams.get('code')
	};

	const aVariableIsNull = Object.values(variables).some((variable) => variable === null);
	const urlMatchesCookies = variables.state === variables.stateCookie;

	if (aVariableIsNull || !urlMatchesCookies) {
		console.log('Atleast one ariable is null or URL does not match variables', variables);
		return null;
	}
	return variables as { [T in keyof typeof variables]: NonNullable<(typeof variables)[T]> };
}

export async function getGoogleUser(accessToken: string) {
	const googleResponse = (await wretch('https://www.googleapis.com/auth/userinfo.profile', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'User-Agent': 'request'
		}
	})
		.get()
		.json()
		.catch((error) => {
			if (error instanceof OAuth2RequestError) {
				return new Response('Invalid code', {
					status: 400
				});
			}
			return new Response(null, {
				status: 500
			});
		})) as GoogleResponse;

	return {
		id: '',
		email: googleResponse.email,
		name: googleResponse.name,
		refreshToken: ''
	} satisfies User;
}

export interface GoogleResponse {
	username: string;
	email: string;
	name: string;
	firstname: string;
	lastname: string;
	avatar: unknown;
	email_verified: number;
}
