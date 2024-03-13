import { signIn } from '../../auth';
import type { Actions } from './$types';

export const actions: Actions = { default: signIn };

// TODO https://medium.com/@uriser/authentication-in-sveltekit-with-auth-js-7ff505d584c4
