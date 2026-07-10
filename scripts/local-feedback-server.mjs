import { mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";

const port = Number(process.env.FEEDBACK_PORT || 8787);
mkdirSync("outputs/day04", { recursive: true });
const database = new DatabaseSync("outputs/day04/clip2map-submissions.sqlite");

database.exec(`
  create table if not exists map_requests (
    id integer primary key,
    email text not null,
    city text not null,
    video_links text not null,
    map_type text not null,
    notes text not null,
    source_page text not null,
    created_at text not null,
    map_title text not null,
    place_count text not null,
    current_storage text not null,
    preferred_input text not null,
    payload text not null
  );

  create table if not exists feedback (
    id integer primary key,
    email text not null,
    goal text not null,
    confusing text not null,
    feature text not null,
    notes text not null,
    source_page text not null,
    created_at text not null,
    payload text not null
  );

  create table if not exists endpoint_fallback (
    id integer primary key,
    email text not null,
    city text not null,
    video_links text not null,
    map_type text not null,
    notes text not null,
    source_page text not null,
    created_at text not null,
    payload text not null
  );
`);

const insertMapRequest = database.prepare(`
  insert into map_requests (
    email, city, video_links, map_type, notes, source_page, created_at,
    map_title, place_count, current_storage, preferred_input, payload
  ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertFeedback = database.prepare(`
  insert into feedback (
    email, goal, confusing, feature, notes, source_page, created_at, payload
  ) values (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertEndpointFallback = database.prepare(`
  insert into endpoint_fallback (
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

function requireStrings(payload, keys) {
  if (keys.some((key) => typeof payload[key] !== "string")) {
    throw new Error("Invalid payload");
  }
}

function saveSubmission(path, payload, body) {
  if (path === "/rest/v1/map_requests") {
    requireStrings(payload, [
      "email",
      "city",
      "video_links",
      "map_type",
      "notes",
      "source_page",
      "created_at",
      "map_title",
      "place_count",
      "current_storage",
      "preferred_input",
    ]);
    return insertMapRequest.run(
      payload.email,
      payload.city,
      payload.video_links,
      payload.map_type,
      payload.notes,
      payload.source_page,
      payload.created_at,
      payload.map_title,
      payload.place_count,
      payload.current_storage,
      payload.preferred_input,
      body,
    );
  }

  if (path === "/rest/v1/feedback") {
    requireStrings(payload, [
      "email",
      "goal",
      "confusing",
      "feature",
      "notes",
      "source_page",
      "created_at",
    ]);
    return insertFeedback.run(
      payload.email,
      payload.goal,
      payload.confusing,
      payload.feature,
      payload.notes,
      payload.source_page,
      payload.created_at,
      body,
    );
  }

  if (path === "/submissions") {
    requireStrings(payload, [
      "email",
      "city",
      "videoLinks",
      "mapType",
      "notes",
      "sourcePage",
      "createdAt",
    ]);
    return insertEndpointFallback.run(
      payload.email,
      payload.city,
      payload.videoLinks,
      payload.mapType,
      payload.notes,
      payload.sourcePage,
      payload.createdAt,
      body,
    );
  }

  return null;
}

createServer((request, response) => {
  const headers = corsHeaders(request.headers.origin);
  if (request.method === "OPTIONS") {
    response.writeHead(204, headers).end();
    return;
  }
  if (request.method !== "POST") {
    response.writeHead(405, headers).end("Insert only");
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
      const result = saveSubmission(request.url, payload, body);
      if (!result) {
        response.writeHead(404, headers).end("Not found");
        return;
      }
      response
        .writeHead(201, { ...headers, "Content-Type": "application/json" })
        .end(JSON.stringify({ id: Number(result.lastInsertRowid) }));
    } catch {
      response.writeHead(400, headers).end("Invalid JSON payload");
    }
  });
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`Clip2Map local submission server: http://127.0.0.1:${port}\n`);
});
