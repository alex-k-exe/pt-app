<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<Card.Root class="w-fit">
	<Card.Header>
		<Card.Title class="flex w-fit items-center">Series <Input placeholder="Name" /></Card.Title>
		<Card.Description class="flex w-fit items-center"
			>Repeat <Input placeholder="n" /> times
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid w-full items-center gap-4">
			<div class="flex flex-col space-y-1.5">
				<Label for="name">Name</Label>
				<Input id="name" placeholder="Name of your project" />
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>
