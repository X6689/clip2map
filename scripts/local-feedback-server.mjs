import { mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";

const port = Number(process.env.FEEDBACK_PORT || 8787);
mkdirSync("outputs/day03", { recursive: true });
const database = new DatabaseSync("outputs/day03/clip2map-feedback.sqlite");

database.exec(`
  create table if not exists submissions (
    id integer primary key,
    email text not null,
    city text not null,
    video_links text not null,
    map_type text not null,
    notes text not null,
    source_page text not null,
    created_at text not null,
    payload text not null
  )
`);

const insert = database.prepare(`
  insert into submissions (
    email, city, video_links, map_type, notes, source_page, created_at, payload
  ) values (?, ?, ?, ?, ?, ?, ?, ?)
`);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, Prefer",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

createServer((request, response) => {
  const headers = corsHeaders(request.headers.origin);
  if (request.method === "OPTIONS") {
    response.writeHead(204, headers).end();
    return;
  }
  if (request.method !== "POST" || request.url !== "/submissions") {
    response.writeHead(404, headers).end("Not found");
    return;
  }

  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
    if (body.length > 100_000) request.destroy();
  });
  request.on("end", () => {
    try {
      const payload = JSON.parse(body);
      const required = [
        "email",
        "city",
        "videoLinks",
        "mapType",
        "notes",
        "sourcePage",
        "createdAt",
      ];
      if (required.some((key) => typeof payload[key] !== "string")) {
        throw new Error("Invalid payload");
      }
      const result = insert.run(
        payload.email,
        payload.city,
        payload.videoLinks,
        payload.mapType,
        payload.notes,
        payload.sourcePage,
        payload.createdAt,
        body,
      );
      response
        .writeHead(201, { ...headers, "Content-Type": "application/json" })
        .end(JSON.stringify({ id: Number(result.lastInsertRowid) }));
    } catch {
      response.writeHead(400, headers).end("Invalid JSON payload");
    }
  });
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`Clip2Map feedback server: http://127.0.0.1:${port}/submissions\n`);
});
