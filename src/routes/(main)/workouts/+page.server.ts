import { activities, clients, users, workouts, type Activity } from '$lib/drizzleTables';
import { getTrainersClients } from '$lib/server/dbUtils.js';
import { dayjs } from '$lib/utils/dates';
import { userTypes, validDate, validMonthDate } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { and, between, eq, or } from 'drizzle-orm';
import { yearSchema } from './schema.js';

export async function load({ locals, url }) {
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');
	const monthString = url.searchParams.get('month');
	const month = validMonthDate.regex.test(monthString ?? '')
		? dayjs(monthString, validMonthDate.format).startOf('month')
		: dayjs().startOf('month');
	const selectedClientId = url.searchParams.get('clientId');

	const foundWorkouts = (
		await locals.db
			.select()
			.from(activities)
			.innerJoin(workouts, eq(activities.id, workouts.id))
			.where(
				and(
					or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id)),
					between(
						workouts.date,
						month.format(validDate.format),
						month.endOf('month').format(validDate.format)
					),
					eq(activities.clientId, selectedClientId ?? activities.clientId)
				)
			)
			.orderBy(workouts.date)
	).map((workout) => {
		return {
			...workout.activities,
			...workout.workouts
		};
	});

	let clientsInWorkoutsNames: string[] | null = null;
	let trainersClients: { id: string; name: string }[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		clientsInWorkoutsNames = await Promise.all(
			foundWorkouts.map(async (workout) => {
				const names = await locals.db
					.select({ clientsName: users.name })
					.from(users)
					.innerJoin(clients, eq(users.id, clients.id))
					.limit(1)
					.where(
						and(eq(clients.id, workout.clientId), eq(clients.id, selectedClientId ?? clients.id))
					);
				return names.length > 0 ? names[0].clientsName : 'No client found';
			})
		);
		trainersClients = await getTrainersClients(locals.db, locals.user.id);
	}

	const groupedWorkouts = new Map<
		string,
		(Activity & {
			clientsName: string | null;
			date: string;
			startTime: string;
			endTime: string;
		})[]
	>();
	foundWorkouts
		.map((workout, i) => {
			return {
				...workout,
				clientsName: clientsInWorkoutsNames ? clientsInWorkoutsNames[i] : null
			};
		})
		.forEach((workout) => {
			const dateKey = dayjs(workout.date).format(validDate.format);
			if (!groupedWorkouts.has(dateKey)) groupedWorkouts.set(dateKey, []);
			groupedWorkouts.get(dateKey)!.push(workout);
		});

	return {
		month: month.toDate(),
		workouts: groupedWorkouts,
		clients: trainersClients,
		selectedClientId
	};
}

export const actions = {
	changeYear: async (event) => {
		const form = yearSchema.safeParse(Number((await event.request.formData()).get('newYear')));
		if (!form.success) return fail(400);

		const month = event.url.searchParams.get('month');
		const monthDate = month ? dayjs(month, validMonthDate.format) : dayjs();
		const selectedClientId = event.url.searchParams.get('clientId');

		return redirect(
			302,
			`/workouts?month=${form.data}-${monthDate.format('MM')}` +
				(selectedClientId ? `&clientId=${selectedClientId}` : '')
		);
	}
};
