<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { dayOnlyFormat, userTypes } from '$lib/utils/types/other.js';
	import dayjs from 'dayjs';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data;
	const date = dayjs(data.date);
	const workouts = data.workouts;
</script>

<a href="/workouts"><Button variant="outline">Go back to month view</Button></a>
{date.format('D MMMM YYYY')}

{#if data.userType === userTypes.TRAINER}
	<a href={`/editor/workout?date=${date.format(dayOnlyFormat)}`}
		><Button>Make a new workout</Button></a
	>
{/if}

<div class="workouts">
	{#each workouts as workout (workout.id)}
		<Card.Root>
			<Card.Header>
				<Card.Title>{date.format('h:ma') + ' to ' + dayjs(date).format('h:ma') + '\n'}</Card.Title>
				<Card.Description>{workout.clientsName + ' - ' + workout.title}</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Card Content</p>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

<Pagination.Root count={workouts.length} perPage={10} let:pages let:currentPage>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton>
				<ChevronLeft />
				<span class="hidden sm:block">Previous</span>
			</Pagination.PrevButton>
		</Pagination.Item>
		{#each pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
			{:else}
				<Pagination.Item>
					<Pagination.Link {page} isActive={currentPage === page.value}>
						{page.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton>
				<span class="hidden sm:block">Next</span>
				<ChevronRight />
			</Pagination.NextButton>
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>

<style>
	.workouts {
		display: flex;
		flex-wrap: wrap;
	}
</style>
