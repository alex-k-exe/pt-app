import { clients, signupTokens, trainers, users, type User } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { validSignupToken } from '$lib/utils/other.js';
import { fail, type ActionFailure } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { Scrypt, generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, validateForm } from '../schema';

export async function load({ platform, url }) {
	const signupTokenId = url.searchParams.get('signupToken');
	const targetHref = url.searchParams.get('targetHref');

	let error: ActionFailure<Record<string, string>> | null = null;
	let trainer: User | null = null;
	processToken: if (signupTokenId) {
		if (!signupTokenId.match(validSignupToken)) {
			error = fail(400, { message: 'Invalid signup token' });
			break processToken;
		}

		const db = initDrizzle(platform);
		const signupToken = (
			await db.select().from(signupTokens).limit(1).where(eq(signupTokens.id, signupTokenId))
		)[0];

		const tokenIsExpired = dayjs(signupToken.creationTimestamp).diff(dayjs(), 'hour') > 10;
		if (tokenIsExpired) {
			error = fail(400, { message: 'Expired signup token' });
			await db.delete(signupTokens).where(eq(signupTokens.id, signupTokenId));
			break processToken;
		}

		if (!signupToken.trainerId) break processToken;
		trainer = (
			await db.select().from(users).limit(1).where(eq(users.id, signupToken.trainerId))
		)[0];
	}

	return {
		signupTokenId,
		trainer,
		error,
		targetHref,
		form: await superValidate(zod(formSchema))
	};
}
export const actions = {
	default: async (event) => {
		const formData = (await validateForm(event)).data;
		if ('form' in formData) return formData;
		const userId = generateId(15);
		const hashedPassword = await new Scrypt().hash(formData.user.password);

		const db = initDrizzle(event.platform);
		try {
			await db.insert(users).values({
				id: userId,
				email: formData.user.email,
				password: hashedPassword,
				name: formData.user.name
			});
		} catch {
			return fail(400, { message: 'Email already used' });
		}

		if (formData.trainerId) {
			await db.insert(clients).values({ id: userId, trainerId: formData.trainerId });
		} else {
			await db.insert(trainers).values({ id: userId });
		}

		const session = await event.locals.lucia.createSession(userId, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		return new Response(null, {
			status: 302,
			headers: {
				Location: formData.targetHref ?? '/workouts',
				'Set-Cookie': sessionCookie.serialize()
			}
		});
	}
};
