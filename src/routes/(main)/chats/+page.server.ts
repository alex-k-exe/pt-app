import { chats, messages } from '$lib/drizzleTables';
import { getChatWithMessages, getChats, getUsersForNewChat } from '$lib/server/dbUtils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ url, locals }) {
	const selectedChatId = url.searchParams.get('chatId');
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');
	const db = locals.db;

	const foundChats = await getChats(db, locals.user?.id);
	const otherTrainers = await getUsersForNewChat(db, foundChats, locals.user.id, locals.userType);

	const selectedChat = selectedChatId
		? getChatWithMessages(db, foundChats, Number(selectedChatId))
		: null;

	return {
		chats: foundChats,
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

		await event.locals.db
			.insert(messages)
			.values({ chatId: form.data.chatId, text: form.data.text, senderId: event.locals.user?.id });
		return redirect(302, `/chats?chatId=${form.data.chatId}`);
	},

	createNewChat: async ({ request, locals }) => {
		const formData = await request.formData();
		const otherUserId = formData.get('otherUserId');
		const userId = locals.user?.id;
		if (!otherUserId || !userId) return fail(400, { formData });

		const createdChatId = (
			await locals.db
				.insert(chats)
				.values({ userId1: userId, userId2: otherUserId.toString() })
				.returning()
		)[0].id;
		return redirect(302, `/chats?chatId=${createdChatId}`);
	},

	deleteChat: async ({ locals, request }) => {
		const chatId = (await request.formData()).get('chatId');
		if (!chatId) return fail(400);

		await locals.db.delete(chats).where(eq(chats.id, Number(chatId.toString())));
		return redirect(302, '/chats');
	}
};
