<a href="/">Home</a>

<hr />
<h1>Email</h1>
<hr />

<h2>Send Test Email</h2>
<form id="send_test_email" method="POST" action="?/send_test_email">
	<label for="send-test-text">Text</label>
	<input type="text" name="send-test-text" id="send-test-text" value="lorem ipsum email" />
	<label for="send-test-number">Number</label>
	<input type="number" name="send-test-number" id="send-test-number" value="123456789" />
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
