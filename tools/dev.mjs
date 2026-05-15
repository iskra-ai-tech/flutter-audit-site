#!/usr/bin/env node
/* Tiny dev server — runs build, watches src/, serves ./public on :8080. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync, watch } from "node:fs";
import { resolve, join, extname } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { gzipSync, brotliCompressSync } from "node:zlib";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const PUBLIC_DIR = join(ROOT, "public");
const PORT = Number(process.env.PORT || 8080);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".mjs":  "text/javascript; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".xml":  "application/xml; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
};

const runBuild = () =>
  new Promise((res) => {
    const t = Date.now();
    const p = spawn(process.execPath, [join(ROOT, "tools", "build.mjs")], { stdio: "inherit" });
    p.on("exit", () => { console.log(`[dev] rebuilt in ${Date.now() - t}ms`); res(); });
  });

await runBuild();

if (!process.argv.includes("--preview")) {
  for (const dir of ["styles", "scripts", "assets"]) {
    const p = join(ROOT, "src", dir);
    if (existsSync(p)) watch(p, { recursive: true }, () => runBuild());
  }
  const html = join(ROOT, "src", "index.html");
  if (existsSync(html)) watch(html, () => runBuild());
}

const COMPRESSIBLE = new Set([".html", ".css", ".js", ".mjs", ".svg", ".xml", ".txt", ".json"]);

createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(req.url.split("?")[0]);
    if (url.endsWith("/")) url += "index.html";
    const f = join(PUBLIC_DIR, url);
    const s = await stat(f);
    if (!s.isFile()) throw 0;
    const ext = extname(f);
    const accept = (req.headers["accept-encoding"] || "").toString();
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "Vary": "Accept-Encoding",
    };
    let body = await readFile(f);
    if (COMPRESSIBLE.has(ext)) {
      if (accept.includes("br")) {
        body = brotliCompressSync(body);
        headers["Content-Encoding"] = "br";
      } else if (accept.includes("gzip")) {
        body = gzipSync(body);
        headers["Content-Encoding"] = "gzip";
      }
    }
    headers["Content-Length"] = body.length;
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
}).listen(PORT, () => console.log(`[dev] http://localhost:${PORT}`));
