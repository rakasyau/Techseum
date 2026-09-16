/*
 * End-to-end registration test against a running dev/prod server.
 *
 *   node scripts/test-register.mjs [baseUrl] [email]
 *
 * Creates a real account through POST /api/auth/register, which exercises the
 * exact code path a user hits: user created, subscriber synced, account
 * welcome email sent. It prints the provider status the route now reports, so
 * a failing email is visible here instead of being swallowed.
 *
 * The account and any verification cookies are for a throwaway address; delete
 * the user from MongoDB afterwards if you want a clean database.
 */

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const stamp = Date.now();
const EMAIL = process.argv[3] || `e2e-${stamp}@example.com`;
const USERNAME = `e2e${stamp}`;
const PASSWORD = "testing-passw0rd";

async function main() {
  console.log(`POST ${BASE}/api/auth/register`);
  console.log(`  email:    ${EMAIL}`);
  console.log(`  username: ${USERNAME}`);

  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: EMAIL,
      username: USERNAME,
      displayName: "E2E Test",
      password: PASSWORD,
    }),
  });

  const setCookie = res.headers.get("set-cookie");
  const body = await res.json().catch(() => null);

  console.log(`  -> HTTP ${res.status}`);
  console.log(`  -> session cookie: ${setCookie ? "yes" : "no"}`);
  console.log(`  -> body: ${JSON.stringify(body)}`);

  if (res.status !== 201) {
    console.error("Registration did not return 201.");
    process.exitCode = 1;
    return;
  }

  const welcome = body?.provider?.welcome;
  console.log("");
  if (welcome === "sent") {
    console.log("Account welcome email: SENT");
  } else {
    console.log(
      `Account welcome email: ${welcome ?? "unknown"} — check the server log ` +
        `for the [resend] line naming the reason.`
    );
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
