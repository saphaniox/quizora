# Quitech Operations

## Deploying database changes

Run migrations before starting an API release:

```powershell
npm --prefix server run migrate
```

Migrations are ordered SQL files in `server/migrations`. Take a database backup before production migrations and confirm the API health endpoint after deployment.

## Resend email provider

To add Resend while retaining SMTP as a fallback choice:

1. Verify `quitech.online` (or the domain used for your sender) in Resend and publish the DNS records Resend provides, including DKIM and SPF records.
2. Add `RESEND_API_KEY` and `RESEND_FROM` to the API service's Coolify environment. Use a verified sender, for example `Quitech <notifications@quitech.online>`. Keep `SUPPORT_EMAIL` set for reply-to.
3. Deploy the API and apply pending database migrations with `npm --prefix server run migrate`.
4. Open Admin → Email and push health, run checks, select Resend as the active email provider, and save. The admin checks the Resend API key and verifies the sender domain before allowing the switch.
5. Send an admin test email and confirm delivery before relying on the provider. Switching providers changes future deliveries; queued emails are sent using the provider active when each job is processed.

## Web release

```powershell
npm --prefix client run build
```

Set `SERVER_API_URL` for the web proxy and keep `DATABASE_URL` server-only.

## Android release

```powershell
npm --prefix client run android:apk
npm --prefix client run android:aab
```

Update `versionCode` and `versionName` in `client/android/app/build.gradle` before publishing. Release builds require the configured signing properties in `client/android/keystore.properties`.

## Backup and restore

Back up PostgreSQL before migrations and on a scheduled basis. A release is not complete until a recent backup can be restored into a temporary database and the API health, login, quiz submission, certificate verification, feedback, and admin endpoints have been smoke-tested.

## Recommended release checks

- Run `npm --prefix server run build`.
- Run `npm --prefix client run build`.
- Run the authentication regression tests from the client package.
- Apply pending migrations.
- Verify signed-out quiz submission and feedback.
- Verify signed-in profile editing, progress sync, export, sign-out, and deletion.
- Verify admin feedback status changes and leaderboard moderation.
- Install the generated APK on a test device before uploading the AAB.
- After migration `017_push_notifications_default_on`, confirm new accounts start with helpful notifications enabled, test the Android/iOS permission prompt, and verify the account setting turns notifications off.
- After migration `018_live_user_presence`, verify authenticated sessions heartbeat every 30 seconds and the admin user list and active-user count refresh every 15 seconds. A session is online only while its last heartbeat is within 90 seconds; otherwise, show it offline with its last-seen time.
