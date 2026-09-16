# Quitech Operations

## Deploying database changes

Run migrations before starting an API release:

```powershell
npm --prefix server run migrate
```

Migrations are ordered SQL files in `server/migrations`. Take a database backup before production migrations and confirm the API health endpoint after deployment.

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
