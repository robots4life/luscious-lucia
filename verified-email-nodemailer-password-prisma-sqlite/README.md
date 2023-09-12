<img src="/lucia.png">

# Authentication with Email authenticated by verification link, Nodemailer, Password and Password Reset Link using SvelteKit, Lucia, Prisma and SQLite

I am using `pnpm` and these aliases and oh my zsh.

<a href="https://pnpm.io/" target="_blank">https://pnpm.io/</a>

<a href="https://pnpm.io/installation#using-a-shorter-alias" target="_blank">https://pnpm.io/installation#using-a-shorter-alias</a>

<a href="https://ohmyz.sh/" target="_blank">https://ohmyz.sh/</a>

`.zshrc`

```bash
alias pi='pnpm install'
alias pa='pnpm add'
alias px="pnpm dlx"
```

## Table of Contents

## 1.0 Set up Email

For sending emails from our app we are going to use <a href="https://nodemailer.com/" target="_blank">https://nodemailer.com/</a>.

During development we are going to preview / check sent email with <a href="https://ethereal.email/" target="_blank">https://ethereal.email/</a>.

Once everything works in development we are going to use a free <a href="https://sendgrid.com/pricing/" target="_blank">https://sendgrid.com/pricing/</a> SendGrid account that allows us to send up to 100 emails per day.

Last not least we are going to deploy our app to Vercel.

### 1.1 Set up Nodemailer

`pi nodemailer`

`npm install nodemailer`
