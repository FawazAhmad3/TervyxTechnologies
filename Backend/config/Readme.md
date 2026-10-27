# Email configuration

Edit `email.json` locally:

- `sender.name`: name shown as the sender.
- `sender.email`: email account used to send notifications.
- `sender.appPassword`: that account’s email app password, not its regular sign-in password.
- `notifications.receivingEmail`: inbox that should receive project enquiries.
- `smtp`: provider settings. The example uses Gmail SMTP with TLS on port 465; change these for another provider.

`email.json` is excluded from Git and readable only by its local owner. `email.example.json` is a blank template that can be shared. Keep real credentials on the backend only; never import this configuration into React or copy it into `Frontend/public` or `dist`.

This prepares configuration only. The current contact form still downloads a quote request; SMTP sending and a backend enquiry endpoint have not been connected yet. On a backend host, provision the private file separately rather than committing it.
