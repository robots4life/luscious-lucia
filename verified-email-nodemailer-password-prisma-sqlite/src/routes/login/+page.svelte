<a href="/">Home</a>
<hr />

<h1>Log In</h1>
<hr />

<h2>Log In With Email</h2>
<form id="log_in_with_email" method="POST">
	<label for="send_email">Email</label>
	<input type="text" name="send_email" id="send_email" value="conner.white16@ethereal.email" />
	<label for="send_password">Password</label>
	<input type="password" name="send_password" id="send_password" value="0123456789876543210" />
	<button form="log_in_with_email" type="submit">Submit</button>
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
