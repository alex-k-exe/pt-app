import { chats, messages, trainers, users, type Message } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { arrayToTuple } from '$lib/utils/other';
import { UserType } from '$lib/utils/types/other';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ platform, url, locals }) {
	let chatId: string | number | null = url.searchParams.get('chatId');
	if (!locals.user?.id) {
		throw redirect(302, '/login?targetPath=/chats' + (chatId ? `?chatId=${chatId}` : ''));
	}
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
		(name) => name[0].name
	);

	const getMostRecentMessages = foundChats.map((chat) => {
		return db
			.select()
			.from(messages)
			.limit(1)
			.orderBy(messages.sentTimestamp)
			.where(eq(messages.chatId, chat.id));
	});
	const whetherChatsAreRead: SimpleChat[] = (
		await db.batch(arrayToTuple(getMostRecentMessages))
	).map((message, i) => {
		return {
			id: foundChats[i].id,
			otherUsersName: otherUsersNames[i],
			hasBeenRead: message[0].readByReciever
		};
	});

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

	let selectedChat: (SimpleChat & { messages: Message[] }) | null = null;
	getSelectedChatMessages: {
		const chatWithoutMessages = chatId
			? whetherChatsAreRead.find((chat) => chat.id === Number(chatId))
			: whetherChatsAreRead[0];
		if (!chatWithoutMessages) break getSelectedChatMessages;
		const selectedChatsMessages = await db
			.select()
			.from(messages)
			.limit(10)
			.orderBy(messages.sentTimestamp)
			.where(eq(messages.chatId, chatWithoutMessages.id));

		const updateMessagesAsRead = selectedChatsMessages.map((message) => {
			return db.update(messages).set({ readByReciever: true }).where(eq(messages.id, message.id));
		});
		await db.batch(arrayToTuple(updateMessagesAsRead));
		selectedChat = { ...chatWithoutMessages, messages: selectedChatsMessages };
	}

	return {
		chats: whetherChatsAreRead,
		selectedChat,
		trainers: otherTrainers,
		form: await superValidate(zod(formSchema))
	};
}

export type SimpleChat = {
	id: number;
	otherUsersName: string;
	hasBeenRead: boolean;
};
export type SimpleUser = {
	id: string;
	name: string;
};

export const actions = {
	sendMessage: async (event) => {
		if (!event.locals.user) throw redirect(302, `/login?targetPath=${event.url.pathname}`);
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

	selectNewChat: async ({ platform, request }) => {
		const chatId = (await request.formData()).get('chatId');
		if (!chatId) return;
		return redirect(302, `/chats?chatId=${chatId}`);
	},

	createNewChat: async ({ platform, request }) => {
		const
	},

	deleteChat: async ({ platform, request }) => {}
};
