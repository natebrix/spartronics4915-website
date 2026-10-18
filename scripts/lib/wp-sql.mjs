// Reads tables out of a WordPress mysqldump (as made by All-in-One WP Migration)
// without needing a MySQL server. Only handles what mysqldump emits:
// CREATE TABLE column lists and multi-row INSERT ... VALUES statements.

import fs from "node:fs";
import readline from "node:readline";

function parseColumns(createStatement) {
  const columns = [];
  for (const line of createStatement.split("\n").slice(1)) {
    const match = line.match(/^\s+`([^`]+)`/);
    if (match) columns.push(match[1]);
  }
  return columns;
}

const ESCAPES = { n: "\n", r: "\r", t: "\t", 0: "\0", Z: "\x1a", b: "\b" };

// Parses the "(...),(...)" part of an INSERT statement into arrays of values.
function parseValues(text, start) {
  const rows = [];
  let row = null;
  let i = start;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "(") {
      row = [];
      i++;
    } else if (ch === ")") {
      rows.push(row);
      row = null;
      i++;
    } else if (ch === "'") {
      let value = "";
      i++;
      while (i < text.length) {
        const c = text[i];
        if (c === "\\") {
          const next = text[i + 1];
          value += ESCAPES[next] ?? next;
          i += 2;
        } else if (c === "'") {
          if (text[i + 1] === "'") {
            value += "'";
            i += 2;
          } else {
            i++;
            break;
          }
        } else {
          value += c;
          i++;
        }
      }
      row.push(value);
    } else if (row && ch !== "," && ch !== " ") {
      let end = i;
      while (end < text.length && text[end] !== "," && text[end] !== ")") end++;
      const raw = text.slice(i, end).trim();
      row.push(raw === "NULL" ? null : Number(raw));
      i = end;
    } else {
      i++;
    }
  }
  return rows;
}

/**
 * Returns { tableName: [rowObject, ...] } for the requested tables.
 * `tables` are names without the prefix, e.g. ["posts", "postmeta"].
 */
export async function readTables(dumpPath, prefix, tables) {
  const wanted = new Set(tables.map((t) => `${prefix}${t}`));
  const columns = {};
  const result = Object.fromEntries(tables.map((t) => [t, []]));
  let create = null;

  const lines = readline.createInterface({
    input: fs.createReadStream(dumpPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    if (create !== null) {
      create.text += `\n${line}`;
      if (line.startsWith(")")) {
        columns[create.table] = parseColumns(create.text);
        create = null;
      }
      continue;
    }
    const createMatch = line.match(/^CREATE TABLE `([^`]+)`/);
    if (createMatch && wanted.has(createMatch[1])) {
      create = { table: createMatch[1], text: line };
      continue;
    }
    const insertMatch = line.match(/^INSERT INTO `([^`]+)` VALUES /);
    if (insertMatch && wanted.has(insertMatch[1])) {
      const table = insertMatch[1];
      const names = columns[table];
      const key = table.slice(prefix.length);
      for (const values of parseValues(line, insertMatch[0].length)) {
        result[key].push(Object.fromEntries(names.map((n, idx) => [n, values[idx]])));
      }
    }
  }
  return result;
}
