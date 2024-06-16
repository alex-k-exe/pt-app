<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { daysOfTheWeek, locations, userTypes, validActiveDays } from '$lib/utils/types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SelectClient from '../../../../lib/components/SelectClient.svelte';
	import ExercisesEditor from '../ExercisesEditor.svelte';
	import { formSchema } from './schema.ts';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	$formData = data.daily;

	let selectedClient =
		data.trainersClients?.find((client) => client.id === data.daily.clientId) ?? null;
	$: $formData.clientId = selectedClient?.id ?? '';

	if (!validActiveDays.test($formData.activeDays)) $formData.activeDays = '0000000';
	let activeDays = $formData.activeDays.split('').map((active) => active === '1');
	$: $formData.activeDays = activeDays.map((active) => (active ? '1' : '0')).join('');

	let deleteForm: HTMLFormElement;
</script>

<form method="POST" action="?/insertOrUpdate" use:enhance>
	<div class="flex">
		<Form.Field {form} name="title">
			<Form.Control let:attrs>
				<Input {...attrs} placeholder="Add a title" bind:value={$formData.title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<SelectClient clients={data.trainersClients} bind:selectedClient />

		<a href="/dailies"><u>Go back to dailies</u></a>
		{#if data.userType === userTypes.TRAINER}
			<Form.Button type="submit">Save</Form.Button>
		{/if}
	</div>

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
		onSelectedChange={(event) => ($formData.location = event?.value ?? '')}
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
	</Select.Root>

	{#if data.daily.id && data.userType === userTypes.TRAINER}
		<form method="POST" action="?/delete" bind:this={deleteForm}>
			<input type="hidden" name="id" value={data.daily.id} />
			<DestructiveButton
				triggerText="Delete this daily"
				on:confirm={() => deleteForm.requestSubmit()}
			/>
		</form>
	{/if}

	<ExercisesEditor bind:series={$formData.series} />
</form>
