import {
	activities,
	chats,
	clients,
	messages,
	series,
	sets,
	trainers,
	users,
	workouts
} from '$lib/drizzleTables';
import { userTypes, validDate, validTime, type ObjectValues } from '$lib/utils/types';
import dayjs from 'dayjs';
import { eq, ne } from 'drizzle-orm';
import type { FormWorkout } from '../../routes/(main)/editor/workout/schema';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { Scrypt } from 'lucia';

export async function populateDatabase(db: BetterSQLite3Database) {
	const scrypt = new Scrypt();
	const [trainer, client] = await db
		.insert(users)
		.values([
			{
				email: 'arnie@gmail.com',
				password: await scrypt.hash('uTkOK5#4o3Xmp8'),
				name: 'Arnold Schwarzenegger'
			},
			{
				email: 'alexkammin@outlook.com',
				password: await scrypt.hash('JTw*DtS4rFsI1*'),
				name: 'Alex Kammin'
			}
		])
		.returning();
	await db.insert(trainers).values({ id: trainer.id });
	await db.insert(clients).values({ id: client.id, trainerId: trainer.id });
}

export async function getSeries(db: BetterSQLite3Database, activityId: number) {
	return await Promise.all(
		(
			await db.select().from(series).orderBy(series.index).where(eq(series.activityId, activityId))
		).map(async (singleSeries) => {
			const dbSets = await db
				.select()
				.from(sets)
				.orderBy(sets.index)
				.where(eq(sets.seriesId, singleSeries.id));
			return { ...singleSeries, sets: dbSets };
		})
	);
}

export async function getWorkout(workoutId: string | number | null, db: BetterSQLite3Database) {
	workoutId = Number(workoutId);
	if (!workoutId) return null;
	const dbWorkout = await db
		.select()
		.from(workouts)
		.innerJoin(activities, eq(activities.id, workouts.id))
		.limit(1)
		.where(eq(workouts.id, workoutId));
	if (dbWorkout.length === 0) return null;
	const workout: FormWorkout = {
		date: dayjs(dbWorkout[0].workouts.date, validDate.format).format(validDate.format),
		startTime: dayjs(dbWorkout[0].workouts.startTime, validTime).format(validTime),
		endTime: dayjs(dbWorkout[0].workouts.endTime, validTime).format(validTime),
		...dbWorkout[0].activities,
		series: []
	};
	workout.series = await getSeries(db, workoutId);

	return workout;
}

export async function getTrainersClients(db: BetterSQLite3Database, trainerId: string) {
	return await db
		.select({ id: users.id, name: users.name })
		.from(users)
		.innerJoin(clients, eq(clients.id, users.id))
		.where(eq(clients.trainerId, trainerId));
}

/** Gets all chats that the user is in */
export async function getChats(db: BetterSQLite3Database, userId: string) {
	// get the id of the other user in the chat when the user is user1
	const user1Chats = await db
		.select({ id: chats.id, otherUsersId: chats.userId2 })
		.from(chats)
		.where(eq(chats.userId1, userId));

	// get the id of the other user in the chat when the user is user2
	const user2Chats = await db
		.select({ id: chats.id, otherUsersId: chats.userId1 })
		.from(chats)
		.where(eq(chats.userId2, userId));

	return await Promise.all(
		[...user1Chats, ...user2Chats].map(async (chat) => {
			return {
				...chat,
				otherUsersName: await getOtherUsersName(db, chat),
				hasBeenRead: (await getMostRecentMessage(db, chat))?.readByReciever ?? true
			};
		})
	);
}

async function getOtherUsersName(db: BetterSQLite3Database, chat: { otherUsersId: string }) {
	return (
		await db
			.select({ name: users.name })
			.from(users)
			.limit(1)
			.where(eq(users.id, chat.otherUsersId))
	)[0].name;
}

/** Get the most recent mesage from the chat */
async function getMostRecentMessage(db: BetterSQLite3Database, chat: { id: number }) {
	const message = await db
		.select()
		.from(messages)
		.limit(1)
		.orderBy(messages.sentTimestamp)
		.where(eq(messages.chatId, chat.id));
	return message.length === 1 ? message[0] : null;
}

/**
 * Get every user that the current user doesn't already have a chat with
 * @param userId ID of the current user
 */
export async function getUsersForNewChat(
	db: BetterSQLite3Database,
	chats: { otherUsersId: string }[],
	userId: string,
	userType: ObjectValues<typeof userTypes>
) {
	let foundTrainers: { id: string; name: string }[];
	if (userType === userTypes.TRAINER) {
		foundTrainers = await db
			.select({ id: users.id, name: users.name })
			.from(trainers)
			.innerJoin(users, eq(users.id, trainers.id))
			.where(ne(users.id, userId))
			.orderBy(users.name);
	} else {
		const trainerId = (
			await db
				.select({ trainerId: clients.trainerId })
				.from(clients)
				.innerJoin(users, eq(users.id, clients.id))
				.where(eq(clients.id, userId))
				.limit(1)
		)[0].trainerId;
		// here foundTrainers will just be the client's trainer
		foundTrainers = await db
			.select({ id: users.id, name: users.name })
			.from(trainers)
			.innerJoin(users, eq(users.id, trainers.id))
			.where(eq(users.id, trainerId))
			.limit(1);
	}

	const foundClients = await getTrainersClients(db, userId);

	return [...foundTrainers, ...foundClients].filter((user) => {
		return !chats.some((chat) => chat.otherUsersId == user.id);
	});
}

/** Get all messages from a chat */
async function getMessages(db: BetterSQLite3Database, chatId: number) {
	const foundMessages = await db
		.select()
		.from(messages)
		.limit(10)
		.orderBy(messages.sentTimestamp)
		.where(eq(messages.chatId, chatId));
	return Promise.all(
		foundMessages.map(async (message) => {
			const sendersName = (
				await db
					.select({ name: users.name })
					.from(users)
					.limit(1)
					.where(eq(users.id, message.senderId))
			)[0].name;
			return { ...message, sendersName };
		})
	);
}

export async function getChatWithMessages(
	db: BetterSQLite3Database,
	chats: { id: number; otherUsersName: string; hasBeenRead: boolean }[],
	chatId: number
) {
	const selectedChat = chats.find((chat) => chat.id === chatId);
	if (!selectedChat) return null;

	const selectedChatsMessages = await getMessages(db, chatId);
	await Promise.all(
		selectedChatsMessages.map(
			async (message) =>
				await db.update(messages).set({ readByReciever: true }).where(eq(messages.id, message.id))
		)
	);
	return { ...selectedChat, messages: selectedChatsMessages };
}
