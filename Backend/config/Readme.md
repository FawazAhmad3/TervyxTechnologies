# Email configuration

Edit `email.json` locally:

- `sender.name`: name shown as the sender.
- `sender.email`: email account used to send notifications.
- `sender.appPassword`: that account’s email app password, not its regular sign-in password.
- `notifications.receivingEmail`: inbox that should receive project enquiries.
- `smtp`: provider settings. The example uses Gmail SMTP with TLS on port 465; change these for another provider.

`email.json` is excluded from Git and readable only by its local owner. `email.example.json` is a blank template that can be shared. Keep real credentials on the backend only; never import this configuration into React or copy it into `Frontend/public` or `dist`.

## Netlify setup

The quotation form sends `POST /api/quotation`, rewritten by `netlify.toml` to the deployed `netlify/functions/quotation.mts` function. The function sends the HTML notification and plain-text alternative to `notifications.receivingEmail`, from your authenticated sender. Reply-To is the visitor’s email. No acknowledgement is sent to the visitor.

1. Fill the private `email.json` with your SMTP details, sender app password, and receiving inbox.
2. In Netlify, open Project configuration → Environment variables.
3. Add **`EMAIL_CONFIG_JSON`**. Set its value to the complete JSON from your private file. Mark it as a secret and enable it for the **Functions** scope and the deployment contexts where you want mail delivery.
4. Redeploy. Never prefix this secret with `VITE_` and never commit the filled JSON.

The hosted function reads the environment variable only. Locally, `npm run dev:backend` reads `Backend/config/email.json` (or `EMAIL_CONFIG_JSON` if set). Run `npm run dev` in another terminal; Vite proxies `/api` to the local backend.

The form reports success only when SMTP accepts the message. Missing configuration or provider failures show a retry message and retain the user’s input. SMTP acceptance does not guarantee inbox delivery; verify the real receiving inbox after configuring your provider. No credentials or SMTP responses are returned to the browser.

Requests validate service names and length limits, escape HTML input, reject cross-origin browser submissions, and include a honeypot field. Netlify applies a five-request-per-minute limit per domain/IP; the standalone server has a local IP limit.

## Preview the email

Run `npx tsx Backend/email/preview.ts` from the repository root, then open `Backend/email/preview.html`. This uses sample data and sends no email. The generated preview is ignored by Git. The template is in `Backend/email/quotationTemplate.ts`.
