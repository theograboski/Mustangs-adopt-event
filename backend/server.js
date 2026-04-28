const db = require("./db"); // Persistence of backend beyond my own memory via SQLite
const express = require("express");
const cors = require("cors");
const eventsByGender = require("./events");

const app = express();
const PORT = 5000;

function clearExpiredReservations(callback) {
  const now = new Date().toISOString();

  db.run(
    `
    UPDATE events
    SET status = 'available',
        reserved_until = NULL
    WHERE status = 'pending'
      AND reserved_until IS NOT NULL
      AND reserved_until <= ?
    `,
    [now],
    (error) => {
      if (error) {
        console.error("Failed to clear expired reservations:", error.message);
      }

      if (callback) {
        callback();
      }
    }
  );
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

// Not hardcoded anymore, persistent SQLite DB
app.get("/api/events", (req, res) => {
  clearExpiredReservations(() => {
    db.all(
      `
      SELECT *
      FROM events
      ORDER BY 
        gender,
        CASE event_group
          WHEN 'Freestyle' THEN 1
          WHEN 'Backstroke' THEN 2
          WHEN 'Breaststroke' THEN 3
          WHEN 'Butterfly' THEN 4
          WHEN 'Individual Medley' THEN 5
          WHEN 'Relays' THEN 6
          ELSE 7
        END
      `,
      [],
      (error, rows) => {
        if (error) {
          return res.status(500).json({ success: false, message: error.message });
        }

        const groupedEvents = {
          men: [],
          women: []
        };

        rows.forEach((row) => {
          const groupName = row.event_group;

          let group = groupedEvents[row.gender].find(
            (section) => section.group === groupName
          );

          if (!group) {
            group = { group: groupName, events: [] };
            groupedEvents[row.gender].push(group);
          }

          group.events.push({
            id: row.id,
            name: row.name,
            price: row.price,
            status: row.status,
            reservedUntil: row.reserved_until,
            donorName: row.donor_name
          });
        });

        res.json(groupedEvents);
      }
    );
  }); });

app.post("/api/events/:eventId/reserve", (req, res) => {
  const { eventId } = req.params;
  const reservedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  db.get(
    "SELECT * FROM events WHERE id = ?",
    [eventId],
    (error, eventItem) => {
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      if (!eventItem) {
        return res.status(404).json({ success: false, message: "Event not found." });
      }

      if (eventItem.status !== "available") {
        return res.status(409).json({
          success: false,
          message: "This event is no longer available."
        });
      }

      db.run(
        "UPDATE events SET status = ?, reserved_until = ? WHERE id = ?",
        ["pending", reservedUntil, eventId],
        (updateError) => {
          if (updateError) {
            return res.status(500).json({
              success: false,
              message: updateError.message
            });
          }

          res.json({
            success: true,
            message: "Event held for 24 hours pending confirmation",
            event: {
              id: eventItem.id,
              name: eventItem.name,
              price: eventItem.price,
              status: "pending",
              reservedUntil
            }
          });
        }
      );
    }
  );
});

app.post("/api/dev/reset-pending", (req, res) => {
  for (const gender of Object.keys(eventsByGender)) {
    for (const group of eventsByGender[gender]) {
      for (const eventItem of group.events) {
        if (eventItem.status === "pending") {
          eventItem.status = "available";
          eventItem.reservedUntil = null;
        }
      }
    }
  }

  res.json({ success: true, message: "Pending events reset." });
});

const ADMIN_PASSWORD = "Pickles123!"; // This will need to be changed if I eventually give others admin access

app.post("/api/admin/adopt/:eventId", (req, res) => {
  const { eventId } = req.params;
  const { password, donorName } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  db.run(
    "UPDATE events SET status = ?, reserved_until = NULL, donor_name = ? WHERE id = ?",
    ["adopted", donorName || null, eventId],
    function (error) {
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      res.json({ success: true, message: "Event marked as adopted" });
    }
  );
});

app.post("/api/admin/available/:eventId", (req, res) => {
  const { eventId } = req.params;
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  db.run(
    "UPDATE events SET status = ?, reserved_until = NULL, donor_name = NULL WHERE id = ?",
    ["available", eventId],
    function (error) {
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      res.json({ success: true, message: "Event marked as available" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});