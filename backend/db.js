const sqlite3 = require("sqlite3").verbose();

const dbPath =
  process.env.NODE_ENV === "production"
    ? "/var/data/mustangs-adopt-event.db"
    : "./mustangs-adopt-event.db";

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
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
`, (createError) => {

  if (createError) {
    console.error("Error creating events table:", createError.message);
    return;
  }

  // Alter tables
  db.run(`
    ALTER TABLE events
    ADD COLUMN donor_name TEXT
    `, (err) => {
    if (err && !err.message.includes("duplicate column")) {
        console.error("Error adding donor_name column:", err.message);
    }
    });

    db.run(`
    ALTER TABLE events
    ADD COLUMN western_record TEXT
    `, (err) => {
    if (err && !err.message.includes("duplicate column")) {
        console.error("Error adding western_record column:", err.message);
    }
    });

    db.run(`
    ALTER TABLE events
    ADD COLUMN record_holder TEXT
    `, (err) => {
    if (err && !err.message.includes("duplicate column")) {
        console.error("Error adding record_holder column:", err.message);
    }
    });

    db.run(`
    ALTER TABLE events
    ADD COLUMN record_year TEXT
    `, (err) => {
    if (err && !err.message.includes("duplicate column")) {
        console.error("Error adding record_year column:", err.message);
    }
    });
  // Seed events
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
    ["men-4x50-free-relay", "men", "Relays", "4x50 Freestyle Relay", 1000],
    ["men-4x50-medley-relay", "men", "Relays", "4x50 Medley Relay", 1000],
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
    ["women-4x50-free-relay", "women", "Relays", "4x50 Freestyle Relay", 1000],
    ["women-4x50-medley-relay", "women", "Relays", "4x50 Medley Relay", 1000],
    ["women-4x100-free-relay", "women", "Relays", "4x100 Freestyle Relay", 1000],
    ["women-4x100-medley-relay", "women", "Relays", "4x100 Medley Relay", 1000],
    ["women-4x200-free-relay", "women", "Relays", "4x200 Freestyle Relay", 1000]
];
  // Insert event
  const insertEvent = db.prepare(`
    INSERT OR IGNORE INTO events (id, gender, event_group, name, price)
    VALUES (?, ?, ?, ?, ?)
    `);

    seedEvents.forEach((eventItem) => {
    insertEvent.run(eventItem);
    });

    insertEvent.finalize();

  // For Western Record updates

  const recordUpdates = [
  // Men - Freestyle
  {
    id: "men-50-free",
    westernRecord: "22.16",
    recordHolder: "Luke Stewart-Beinder",
    recordYear: "2025"
  },
  {
    id: "men-100-free",
    westernRecord: "48.39",
    recordHolder: "Luke Stewart-Beinder",
    recordYear: "2025"
  },
  {
    id: "men-200-free",
    westernRecord: "1:45.92",
    recordHolder: "Sebastian Paulins",
    recordYear: "2022"
  },
  {
    id: "men-400-free",
    westernRecord: "3:44.43",
    recordHolder: "Sebastian Paulins",
    recordYear: "2022"
  },
  {
    id: "men-1500-free",
    westernRecord: "14:58.93",
    recordHolder: "Sebastian Paulins",
    recordYear: "2022"
  },

  // Men - Backstroke
  {
    id: "men-50-back",
    westernRecord: "25.22",
    recordHolder: "Gordon Barkwell",
    recordYear: "2017"
  },
  {
    id: "men-100-back",
    westernRecord: "54.51",
    recordHolder: "Gordon Barkwell",
    recordYear: "2017"
  },
  {
    id: "men-200-back",
    westernRecord: "1:59.37",
    recordHolder: "Matthew Klahsen",
    recordYear: "2020"
  },

  // Men - Breaststroke
  {
    id: "men-50-breast",
    westernRecord: "27.59",
    recordHolder: "Isaac Allen",
    recordYear: "2026"
  },
  {
    id: "men-100-breast",
    westernRecord: "59.75",
    recordHolder: "Matthew Loewen",
    recordYear: "2018"
  },
  {
    id: "men-200-breast",
    westernRecord: "2:11.31",
    recordHolder: "David Riley",
    recordYear: "2017"
  },

  // Men - Butterfly
  {
    id: "men-50-fly",
    westernRecord: "24.10",
    recordHolder: "Connor Barnardo",
    recordYear: "2026"
  },
  {
    id: "men-100-fly",
    westernRecord: "52.72",
    recordHolder: "Gamal Assad",
    recordYear: "2017"
  },
  {
    id: "men-200-fly",
    westernRecord: "1:57.76",
    recordHolder: "Sebastian Paulins",
    recordYear: "2022"
  },

  // Men - Individual Medley
  {
    id: "men-200-im",
    westernRecord: "1:59.14",
    recordHolder: "Isaac Allen",
    recordYear: "2026"
  },
  {
    id: "men-400-im",
    westernRecord: "4:21.21",
    recordHolder: "Sebastian Paulins",
    recordYear: "2020"
  },

  // Women - Freestyle
  {
    id: "women-50-free",
    westernRecord: "24.76",
    recordHolder: "Zea Wetzlaugk",
    recordYear: "2026"
  },
  {
    id: "women-100-free",
    westernRecord: "54.43",
    recordHolder: "Charis Huddle",
    recordYear: "2019"
  },
  {
    id: "women-200-free",
    westernRecord: "1:59.81",
    recordHolder: "Emma Sproule",
    recordYear: "2013"
  },
  {
    id: "women-400-free",
    westernRecord: "4:13.25",
    recordHolder: "Emma Sproule",
    recordYear: "2014"
  },
  {
    id: "women-800-free",
    westernRecord: "8:46.64",
    recordHolder: "Brittany Cooper",
    recordYear: "2009"
  },

  // Women - Backstroke
  {
    id: "women-50-back",
    westernRecord: "27.85",
    recordHolder: "Sydney Hardeman",
    recordYear: "2026"
  },
  {
    id: "women-100-back",
    westernRecord: "1:00.70",
    recordHolder: "Charis Huddle",
    recordYear: "2018"
  },
  {
    id: "women-200-back",
    westernRecord: "2:09.61",
    recordHolder: "Emma Sproule",
    recordYear: "2014"
  },

  // Women - Breaststroke
  {
    id: "women-50-breast",
    westernRecord: "30.34",
    recordHolder: "Shona Branton",
    recordYear: "2024"
  },
  {
    id: "women-100-breast",
    westernRecord: "1:05.70",
    recordHolder: "Shona Branton",
    recordYear: "2024"
  },
  {
    id: "women-200-breast",
    westernRecord: "2:26.56",
    recordHolder: "Shona Branton",
    recordYear: "2024"
  },

  // Women - Butterfly
  {
    id: "women-50-fly",
    westernRecord: "26.63",
    recordHolder: "Sydney Hardeman",
    recordYear: "2026"
  },
  {
    id: "women-100-fly",
    westernRecord: "59.70",
    recordHolder: "Paulina Bond",
    recordYear: "2014"
  },
  {
    id: "women-200-fly",
    westernRecord: "2:13.72",
    recordHolder: "Jennifer McNaughton",
    recordYear: "2016"
  },

  // Women - Individual Medley
  {
    id: "women-200-im",
    westernRecord: "2:15.45",
    recordHolder: "Ella Rennie",
    recordYear: "2020"
  },
  {
    id: "women-400-im",
    westernRecord: "4:44.88",
    recordHolder: "Jennifer McNaughton",
    recordYear: "2014"
  }
];
db.serialize(() => {
recordUpdates.forEach((record) => {
  db.run(
    `
    UPDATE events
    SET western_record = ?,
        record_holder = ?,
        record_year = ?
    WHERE id = ?
    `,
    [
      record.westernRecord,
      record.recordHolder,
      record.recordYear,
      record.id
    ]
  );
})});

});


module.exports = db;