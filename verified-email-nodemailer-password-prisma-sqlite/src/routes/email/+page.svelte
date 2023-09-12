<a href="/">Home</a>

<hr />
<h1>Email</h1>
<hr />

<h2>Send Test Email</h2>
<form id="send_test_email" method="POST">
	<label for="send_text">Text</label>
	<input type="text" name="send_text" id="send_text" value="Lorem Ipsum Email Text" />
	<label for="send_number">Number</label>
	<input type="number" name="send_number" id="send_number" value="123456789" />
	<button form="send_test_email" type="submit">Submit</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	button {
		border-radius: 10px;
	}
</style>
