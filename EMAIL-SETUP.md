# Contact form email setup

The contact form in `contact.html` now submits enquiries to:

`meltonmaguvalu@gmail.com`

It uses FormSubmit, which is suitable for this static HTML website and does not require a custom server.

## One-time activation

1. Publish the website.
2. Submit the contact form once.
3. Open the activation email sent by FormSubmit to `meltonmaguvalu@gmail.com`.
4. Click the activation/confirmation link.

After activation, new website enquiries will be delivered to that inbox.

## Included safeguards

- Required name, email, enquiry type, and message fields
- Browser email validation
- Honeypot spam field
- Table-formatted email notifications
- Descriptive email subject

FormSubmit is a third-party service. For a fully self-hosted solution, deploy a server-side mail endpoint and replace the form `action` URL.
