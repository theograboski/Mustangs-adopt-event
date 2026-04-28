const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./mustangs-adopt-event.db", (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    gender TEXT NOT NULL,
    event_group TEXT NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    reserved_until TEXT
  )
`);

db.run(`
  ALTER TABLE events
  ADD COLUMN donor_name TEXT
`, (err) => {
  if (err && !err.message.includes("duplicate column")) {
    console.error("Error adding donor_name column:", err.message);
  }
});

const seedEvents = [
  // Men - Freestyle
  ["men-50-free", "men", "Freestyle", "50 Free", 500],
  ["men-100-free", "men", "Freestyle", "100 Free", 500],
  ["men-200-free", "men", "Freestyle", "200 Free", 500],
  ["men-400-free", "men", "Freestyle", "400 Free", 500],
  ["men-1500-free", "men", "Freestyle", "1500 Free", 500],

  // Men - Backstroke
  ["men-50-back", "men", "Backstroke", "50 Back", 500],
  ["men-100-back", "men", "Backstroke", "100 Back", 500],
  ["men-200-back", "men", "Backstroke", "200 Back", 500],

  // Men - Breaststroke
  ["men-50-breast", "men", "Breaststroke", "50 Breast", 500],
  ["men-100-breast", "men", "Breaststroke", "100 Breast", 500],
  ["men-200-breast", "men", "Breaststroke", "200 Breast", 500],

  // Men - Butterfly
  ["men-50-fly", "men", "Butterfly", "50 Fly", 500],
  ["men-100-fly", "men", "Butterfly", "100 Fly", 500],
  ["men-200-fly", "men", "Butterfly", "200 Fly", 500],

  // Men - Individual Medley
  ["men-200-im", "men", "Individual Medley", "200 I.M.", 500],
  ["men-400-im", "men", "Individual Medley", "400 I.M.", 500],

  // Men - Relays
  ["men-4x100-free-relay", "men", "Relays", "4x100 Freestyle Relay", 1000],
  ["men-4x100-medley-relay", "men", "Relays", "4x100 Medley Relay", 1000],
  ["men-4x200-free-relay", "men", "Relays", "4x200 Freestyle Relay", 1000],

  // Women - Freestyle
  ["women-50-free", "women", "Freestyle", "50 Free", 500],
  ["women-100-free", "women", "Freestyle", "100 Free", 500],
  ["women-200-free", "women", "Freestyle", "200 Free", 500],
  ["women-400-free", "women", "Freestyle", "400 Free", 500],
  ["women-800-free", "women", "Freestyle", "800 Free", 500],

  // Women - Backstroke
  ["women-50-back", "women", "Backstroke", "50 Back", 500],
  ["women-100-back", "women", "Backstroke", "100 Back", 500],
  ["women-200-back", "women", "Backstroke", "200 Back", 500],

  // Women - Breaststroke
  ["women-50-breast", "women", "Breaststroke", "50 Breast", 500],
  ["women-100-breast", "women", "Breaststroke", "100 Breast", 500],
  ["women-200-breast", "women", "Breaststroke", "200 Breast", 500],

  // Women - Butterfly
  ["women-50-fly", "women", "Butterfly", "50 Fly", 500],
  ["women-100-fly", "women", "Butterfly", "100 Fly", 500],
  ["women-200-fly", "women", "Butterfly", "200 Fly", 500],

  // Women - Individual Medley
  ["women-200-im", "women", "Individual Medley", "200 I.M.", 500],
  ["women-400-im", "women", "Individual Medley", "400 I.M.", 500],

  // Women - Relays
  ["women-4x100-free-relay", "women", "Relays", "4x100 Freestyle Relay", 1000],
  ["women-4x100-medley-relay", "women", "Relays", "4x100 Medley Relay", 1000],
  ["women-4x200-free-relay", "women", "Relays", "4x200 Freestyle Relay", 1000]
];

const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO events (id, gender, event_group, name, price)
  VALUES (?, ?, ?, ?, ?)
`);

seedEvents.forEach((eventItem) => {
  insertEvent.run(eventItem);
});

insertEvent.finalize();

module.exports = db;