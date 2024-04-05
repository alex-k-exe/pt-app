import { chats } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ platform, url, locals }) {
	const chatId = url.searchParams.get('chatId');
	if (!locals.user?.id) throw redirect(302, '/login?targetHref=/chats?chatId=' + chatId);
	// get first 10 chats and other user's name
	// if chatId, get first 10 messages from that chat
	const db = initDrizzle(platform);
	// get the id of the other person in the chat when the user is user1
	let foundChats = (
		await db.select({ id: chats.id, userId: chats.userId2 }).from(chats).where(eq(chats.userId1, locals.user?.id))
	);

	// get the id of the other person
	foundChats = [
		...foundChats,
		(
			await db
				.select({ chats.id, userId: chats.userId1 })
				.from(chats)
				.where(eq(chats.userId2, locals.user.id))
		)
	];

	return {};
}
