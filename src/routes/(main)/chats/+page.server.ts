import { chats, messages, trainers, users, type Message } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { arrayToTuple } from '$lib/utils/other';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ platform, url, locals }) {
	let chatId: string | number | null = url.searchParams.get('chatId');
	if (!locals.user?.id) return redirect(302, '/login');
	// get first 10 chats and other user's name
	// if chatId, get first 10 messages from that chat
	const db = initDrizzle(platform);
	// get the id of the other user in the chat when the user is user1

	const foundChats = await getChats(db, locals.user?.id);
	const namesOfOtherUsers = await getOtherUsersNames(db, foundChats);
	const mostRecentMessages = await getMostRecentMessages(db, foundChats);
	const combinedChatInfo: { id: number; otherUsersName: string; hasBeenRead: boolean }[] =
		foundChats.map((chat, i) => {
			return {
				id: chat.id,
				otherUsersName: namesOfOtherUsers[i],
				hasBeenRead: mostRecentMessages[i] ? mostRecentMessages[i].readByReciever : true
			};
		});

	const otherTrainers = await getUsersForNewChat(db, foundChats, locals.user?.id);

	let selectedChat:
		| (typeof combinedChatInfo)[0]
		| ((typeof combinedChatInfo)[0] & { messages: Message[] })
		| null = null;
	let selectedChatsMessages: Message[] | null = null;
	getSelectedChat: if (chatId) {
		selectedChat = combinedChatInfo.find((chat) => chat.id === Number(chatId)) ?? null;
		if (selectedChat === null) break getSelectedChat;

		selectedChatsMessages = await getMessages(db, Number(chatId));
		selectedChat = { ...selectedChat, messages: selectedChatsMessages };
		const updateMessagesAsRead = selectedChatsMessages.map((message) => {
			return db.update(messages).set({ readByReciever: true }).where(eq(messages.id, message.id));
		});
		await db.batch(arrayToTuple(updateMessagesAsRead));
	}

	return {
		chats: combinedChatInfo,
		selectedChat,
		trainers: otherTrainers,
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	sendMessage: async (event) => {
		if (!event.locals.user) return redirect(302, `/login?targetPath=${event.url.pathname}`);
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		await initDrizzle(event.platform)
			.insert(messages)
			.values({ chatId: form.data.chatId, text: form.data.text, senderId: event.locals.user?.id });
	},

	deleteMessage: async ({ platform, request }) => {
		const messageId = (await request.formData()).get('messageId');
		if (!messageId) return fail(500, { formData: await request.formData() });

		await initDrizzle(platform)
			.delete(messages)
			.where(eq(messages.id, Number(messageId)));
	},

	selectNewChat: async ({ request }) => {
		const chatId = (await request.formData()).get('chatId');
		if (!chatId) return;
		return redirect(302, `/chats?chatId=${chatId}`);
	},

	createNewChat: async ({ platform, request, locals }) => {
		const formData = await request.formData();
		const otherUserId = formData.get('otherUserId');
		const userId = locals.user?.id;
		if (!otherUserId || !userId) return fail(500, { formData });

		const createdChatId = (
			await initDrizzle(platform)
				.insert(chats)
				.values({ userId1: userId, userId2: otherUserId.toString() })
				.returning()
		)[0].id;
		return redirect(302, `/chats?chatId=${createdChatId}`);
	},

	deleteChat: async ({ platform, request }) => {
		const formData = await request.formData();
		const chatId = formData.get('chatId');
		if (!chatId) return fail(500, { formData });

		await initDrizzle(platform)
			.delete(chats)
			.where(eq(chats.id, Number(chatId)));
		return redirect(302, '/chats');
	}
};

/** Gets all chats that the user is in */
async function getChats(db: DrizzleD1Database, userId: string) {
	// get the id of the other user in the chat when the user is user1
	const foundChats = await db
		.select({ id: chats.id, otherUsersId: chats.userId2 })
		.from(chats)
		.where(eq(chats.userId1, userId));

	// get the id of the other user in the chat when the user is user2
	return [
		...foundChats,
		...(await db
			.select({ id: chats.id, otherUsersId: chats.userId1 })
			.from(chats)
			.where(eq(chats.userId2, userId)))
	];
}

async function getOtherUsersNames(db: DrizzleD1Database, chats: { otherUsersId: string }[]) {
	// const queries = chats.map((chat) => {
	// 	return db
	// 		.select({ name: users.name })
	// 		.from(users)
	// 		.limit(1)
	// 		.where(eq(users.id, chat.otherUsersId));
	// });
	// return (await db.batch(arrayToTuple(queries))).map((name) => name[0].name);
	if (chats.length === 0) return [];
	return [
		(
			await db
				.select({ name: users.name })
				.from(users)
				.limit(1)
				.where(eq(users.id, chats[0].otherUsersId))
		)[0].name
	];
}

async function getMostRecentMessages(db: DrizzleD1Database, chats: { id: number }[]) {
	// const queries = chats.map((chat) => {
	// 	return db
	// 		.select()
	// 		.from(messages)
	// 		.limit(1)
	// 		.orderBy(messages.sentTimestamp)
	// 		.where(eq(messages.chatId, chat.id));
	// });
	// return (await db.batch(arrayToTuple(queries))).map((message) => message[0]);
	if (chats.length === 0) return [];
	return db
		.select()
		.from(messages)
		.limit(1)
		.orderBy(messages.sentTimestamp)
		.where(eq(messages.chatId, chats[0].id));
}

/**
 * Gets every trainer that the user doesn't already have a chat with other than the current user
 * @param currentUserId ID of the current user, assuming they are a trainer
 */
async function getUsersForNewChat(
	db: DrizzleD1Database,
	chats: { otherUsersId: string }[],
	currentUserId: string
) {
	const otherTrainers = (
		await db
			.select({ id: users.id, name: users.name })
			.from(trainers)
			.leftJoin(users, eq(users.id, trainers.id))
			.orderBy(users.name)
	).filter((trainer): trainer is { id: string; name: string } => trainer !== null);

	return otherTrainers
		.filter((trainer) => {
			const chatExistsWithTrainer = chats.some((chat) => chat.otherUsersId !== trainer.id);
			return !chatExistsWithTrainer && trainer.id !== currentUserId;
		})
		.map((trainer) => ({ ...trainer }));
}

async function getMessages(db: DrizzleD1Database, chatId: number) {
	return await db
		.select()
		.from(messages)
		.limit(10)
		.orderBy(messages.sentTimestamp)
		.where(eq(messages.chatId, chatId));
}
