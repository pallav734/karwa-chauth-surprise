require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

app.use(cors());
app.use(express.json());

/*
 * Personalize the moonrise countdown:
 * Set MOONRISE_AT to an ISO date/time with your local UTC offset.
 * Example for India Standard Time (UTC+05:30):
 * MOONRISE_AT=2026-10-23T18:15:00+05:30
 *
 * Replace the example with the correct local date and moonrise time for
 * your city and the Karwa Chauth you are celebrating. Leave unset to show
 * a helpful setup note instead of a misleading countdown.
 */
const moonriseAt = process.env.MOONRISE_AT || "";
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/surprise", (_req, res) => {
  const parsedDate = moonriseAt ? new Date(moonriseAt) : null;
  const validMoonrise = parsedDate && !Number.isNaN(parsedDate.getTime());

  res.json({
    title: "For my moon, my Surbhi.",
    from: "Pallav",
    to: "Surbhi",
    message: "You make the ordinary feel special, and every place feel like home. Happy Karwa Chauth, my love!",
    promise: "I will keep choosing you, every single day.",
    moonriseAt: validMoonrise ? parsedDate.toISOString() : null,
    moonriseLabel: validMoonrise
      ? `Countdown set for ${parsedDate.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })} IST.`
      : "Set MOONRISE_AT in your environment to enable a real countdown."
  });
});

// Serve the built React app from Express in production.
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Karwa Chauth API listening on http://localhost:${PORT}`);
  if (!moonriseAt) {
    console.log("MOONRISE_AT is not set; the countdown will show setup guidance.");
  }
});
