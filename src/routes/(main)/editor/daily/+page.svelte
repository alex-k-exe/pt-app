<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { numberToLetter } from '$lib/utils/other';
	import { daysOfTheWeek, locations } from '$lib/utils/types/other';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SetComponent from '../SetComponent.svelte';
	import { formSchema } from './schema.ts';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	const flipDurationMs = 300;
	function handleAddElement(elementType: 'series' | 'exercise') {
		if (elementType === 'series') {
			$formData.series = [
				...$formData.series,
				{
					index: $formData.series.length,
					reps: 1,
					sets: []
				}
			];
		} else {
			$formData.sets = [
				...$formData.sets,
				{
					index: $formData.sets.length,
					exerciseName: 'Example'
				}
			];
		}
	}

	let selectedClient: { id: string; name: string } | null = null;
	$: if (selectedClient?.id) $formData.clientId = selectedClient?.id;

	let activeDays = (data.daily.activeDays ?? '0000000').split('').map((active) => active === '1');
	$: $formData.activeDays = activeDays.map((active) => (active ? '1' : '0')).join();
	$formData.trainerId = data.daily.trainerId;
</script>

<form method="POST" action="?/insertOrUpdate" use:enhance>
	<div class="flex">
		<Form.Field {form} name="title">
			<Form.Control let:attrs>
				<Form.Label>Title</Form.Label>
				<Input {...attrs} placeholder="Add a title" bind:value={$formData.title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="clientId">
			<Form.Control let:attrs>
				<Select.Root
					selected={{ value: selectedClient?.id, label: selectedClient?.name }}
					onSelectedChange={(event) => {
						if (!event || !event.value || !event.label) return;
						selectedClient = { id: event.value, name: event.label };
					}}
				>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Select a client" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each data.clientNames as { id, name }}
								<Select.Item value={id} label={name}>{name}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input {...attrs} />
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<a href="/dailies">Cancel</a>
		<Form.Button>Save</Form.Button>
	</div>

	<Form.Field {form} name="startTime">
		<Form.Control>
			<Form.Label>Start time</Form.Label>
			<TimePicker bind:selectedDate={$formData.startTime} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="endTime">
		<Form.Control>
			<Form.Label>End time</Form.Label>
			<TimePicker bind:selectedDate={$formData.endTime} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	On these days:
	<div class="flex flex-wrap gap-2">
		{#each activeDays as active, i}
			<Button
				variant={active ? 'default' : 'outline'}
				size="icon"
				on:click={() => {
					activeDays = [...activeDays.slice(0, i), !activeDays[i], ...activeDays.slice(i + 1)];
				}}>{daysOfTheWeek[i][0]}</Button
			>
		{/each}
	</div>

	<Textarea name="notes" placeholder="Notes" bind:value={$formData.notes} />

	<Select.Root
		selected={{ value: $formData.location, label: $formData.location ?? 'Select a location' }}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a location" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each Object.values(locations) as location}
					<Select.Item bind:value={location} label={location}>{location}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="location" />
	</Select.Root>

	{#if data.daily.id}
		<form method="POST" action="?delete">
			<input type="hidden" name="id" value={data.daily.id} />
			<Button>Delete this daily</Button>
		</form>
	{/if}

	<Separator />

	<div class="dailyEditor">
		<div>
			<Button variant="outline" on:click={() => handleAddElement('series')}
				>Add another Series</Button
			>
			<Button variant="outline" on:click={() => handleAddElement('exercise')}
				>Add another Exercise</Button
			>
		</div>
		<div
			class="createdDaily"
			use:dndzone={{ items: [...$formData.series, ...$formData.sets], flipDurationMs }}
		>
			{#each $formData.series ?? [] as series, i (i)}
				<div animate:flip={{ duration: flipDurationMs }}>
					<Card.Root class="w-fit">
						<Card.Header>
							<Card.Title class="flex w-fit items-center"
								>Series {numberToLetter(series.index)}</Card.Title
							>
							<Card.Description class="flex w-fit items-center"
								>Repeat <Input placeholder="n" /> times
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div use:dndzone={{ items: series.sets, flipDurationMs }}>
								{#each series.sets ?? [] as set, j (j)}
									<!-- TODO: implement comparison set -->
									<div animate:flip={{ duration: flipDurationMs }}>
										<SetComponent {set} />
									</div>
								{/each}
							</div>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<Button variant="outline">Cancel</Button>
							<Button>Deploy</Button>
						</Card.Footer>
					</Card.Root>
				</div>
			{/each}
		</div>
	</div>
</form>
