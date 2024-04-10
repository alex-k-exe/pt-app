import { chats, messages, trainers, users, type Message } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { arrayToTuple } from '$lib/utils/other';
import { UserType } from '$lib/utils/types/other';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ platform, url, locals }) {
	const chatId = url.searchParams.get('chatId');
	if (!locals.user?.id)
		throw redirect(302, '/login?targetPath=/chats' + (chatId ? `?chatId=${chatId}` : ''));
	// get first 10 chats and other user's name
	// if chatId, get first 10 messages from that chat
	const db = initDrizzle(platform);
	// get the id of the other user in the chat when the user is user1
	let foundChats = await db
		.select({ id: chats.id, userId: chats.userId2 })
		.from(chats)
		.where(eq(chats.userId1, locals.user?.id));

	// get the id of the other user in the chat when the user is user2
	foundChats = [
		...foundChats,
		...(await db
			.select({ id: chats.id, userId: chats.userId1 })
			.from(chats)
			.where(eq(chats.userId2, locals.user.id)))
	];

	const getOtherUsersNames = foundChats.map((chat) => {
		return db.select({ name: users.name }).from(users).limit(1).where(eq(users.id, chat.userId));
	});
	const otherUsersNames = (await db.batch(arrayToTuple(getOtherUsersNames))).map(
		(chat) => chat[0].name
	);

	let focusedChatsMessages: Message[] | null = null;
	if (chatId) {
		focusedChatsMessages = await db
			.select()
			.from(messages)
			.limit(10)
			.orderBy(messages.sentTimestamp)
			.where(eq(messages.chatId, Number(chatId)));

		const batchQueries = focusedChatsMessages.map((message) => {
			return db.update(messages).set({ readByReciever: true }).where(eq(messages.id, message.id));
		});
		await db.batch(arrayToTuple(batchQueries));
	}

	type SimpleUser = { id: string; name: string };
	let otherTrainers: SimpleUser[] = [];
	if (locals.userType === UserType.TRAINER) {
		otherTrainers = (
			await db
				.select({ id: users.id, name: users.name })
				.from(trainers)
				.leftJoin(users, eq(users.id, trainers.id))
				.orderBy(users.name)
		)
			.filter((trainer): trainer is SimpleUser => {
				const chatExistsWithTrainer = foundChats.some((chat) => chat.userId !== trainer.id);
				return trainer !== null && !chatExistsWithTrainer;
			})
			.map((trainer) => {
				return { ...trainer };
			});
	}

	return {
		chats: foundChats.map((chat, i) => {
			return { id: chat.id, otherUsersName: otherUsersNames[i] };
		}),
		messages: focusedChatsMessages,
		trainers: otherTrainers
	};
}
