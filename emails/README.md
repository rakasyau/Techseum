# Email templates

Paste-ready templates for the Techseum newsletter. These are the exact templates
the application sends, exported to standalone files so you can also use them
directly in Resend.

| File | When it is sent |
|---|---|
| `welcome.html` | Immediately when someone subscribes from the site footer |
| `weekly-digest.html` | The weekly roundup of new exhibits |
| `subjects.txt` | The matching subject lines |

## How to paste into Resend

### Option A — Resend Templates

1. Open the [Resend dashboard](https://resend.com) → **Templates** → **Create template**.
2. Name it, e.g. `Welcome`.
3. Set the **Subject** to the matching line from `subjects.txt`.
4. In the **Body**, switch the editor to **HTML** and paste the entire contents of
   `welcome.html`.
5. Save. Repeat for `weekly-digest.html` with the name `Weekly Digest`.

The templates use `{{{RESEND_UNSUBSCRIBE_URL}}}`, which Resend replaces with each
recipient's own unsubscribe link when you send a broadcast. It stays literal if
you send it as a one-off email via the API, which is harmless.

### Option B — Send from code

The application already sends the welcome email itself. The templates live in
`lib/email-templates.ts` as functions, and the files in this folder are generated
from them:

- `welcomeEmail()` — the signup email
- `weeklyDigestEmail(exhibits)` — the weekly roundup

Both return `{ subject, html, text }`, so they can be passed straight to the
Resend API. `scripts/send-digest.mjs` is a working example that sends the digest
to every subscriber in the database.

## Sender address

Until you verify a domain in Resend, the only usable sender is
`onboarding@resend.dev`, and Resend will only deliver to the email address that
owns the Resend account. Verify a domain, then set `NEWSLETTER_FROM` to it:

```
NEWSLETTER_FROM="Techseum <news@yourdomain.com>"
```

## Regenerating these files

They are produced by a small script so they always match the code. After editing
`lib/email-templates.ts`, regenerate them.

## Design

Both templates share the site's design language: a white ground, near-black
display type, one indigo accent, hairline rules and large rounded corners. They
use table-based layout with inline styles because email clients do not support
modern CSS.
