import type { RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import wretch from 'wretch';
import type { User } from './drizzleTables';
import type { GoogleResponse } from './lucia';

export function getAuthVariables({ url, cookies }: RequestEvent) {
	const variables = {
		codeVerifier: url.searchParams.get('code'),
		state: url.searchParams.get('state'),
		storedState: cookies.get('google_oauth_state')
	};

	const aVariableIsNull = Object.values(variables).some((variable) => variable === null);
	const urlMatchesCookies = variables.state === variables.storedState;

	if (aVariableIsNull || !urlMatchesCookies) {
		console.log('Variable is null or URL does not match variables', variables);
		return new Response(null, {
			status: 400
		});
	}
	return variables as { [T in keyof typeof variables]: NonNullable<(typeof variables)[T]> };
}

export async function getGoogleUser(accessToken: string) {
	const googleResponse = (await wretch('https://www.googleapis.com/auth/userinfo.email', {
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
		name: googleResponse.name
	} satisfies User;
}
