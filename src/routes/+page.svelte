<script>
	let hello = 2;
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: 'Poppins', sans-serif;
		background-color: #202142;
		line-height: 1.6;
		color: #fff;
	}

	:global(ul) {
		list-style: none;
	}

	:global(a) {
		color: orange;
	}

	:global(.container) {
		max-width: 768px;
		margin: 100px auto;
		padding: 0 20px;
	}
</style>
