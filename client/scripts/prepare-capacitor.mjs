import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { join } from "node:path";

const clientRoot = process.cwd();
const sourceRoot = join(clientRoot, ".output", "public");
const targetRoot = join(clientRoot, "capacitor-www");
const assetsRoot = join(sourceRoot, "assets");

const assetNames = await readdir(assetsRoot);
const entry = assetNames.find((name) => /^index-[^/]+\.js$/.test(name));
const stylesheet = assetNames.find((name) => /^styles-[^/]+\.css$/.test(name));

if (!entry || !stylesheet) {
  throw new Error("Production client assets were not found. Run the client build first.");
}

await rm(targetRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });
await cp(sourceRoot, targetRoot, { recursive: true });

const serverPath = join(clientRoot, ".output", "server", "index.mjs");
const port = 4173;
const server = spawn(process.execPath, [serverPath], {
  cwd: clientRoot,
  env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
  stdio: "ignore",
});

let html;
try {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (!response.ok) throw new Error(`SSR returned ${response.status}`);
      html = await response.text();
      break;
    } catch (error) {
      if (attempt === 49) throw error;
      await delay(100);
    }
  }
} finally {
  server.kill();
}

if (!html) throw new Error("Could not generate the Capacitor SSR document.");

html = html
  .replaceAll('href="/', 'href="./')
  .replaceAll('src="/', 'src="./')
  .replaceAll('content="/', 'content="./')
  .replaceAll("url(/", "url(./");

await writeFile(join(targetRoot, "index.html"), html, "utf8");
console.log(`Prepared local Capacitor bundle with ${entry} and ${stylesheet}`);
