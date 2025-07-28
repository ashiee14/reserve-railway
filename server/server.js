const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');

const app = express();
const PORT = 5000;

// Enable CORS for React frontend
app.use(cors());
app.use(express.json());

// (OPTIONAL) If using a JSON file as a mock database
const file = './db.json';
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize database with default trains
async function initializeDB() {
  await db.read();
  if (!db.data) {
    db.data = {
      trains: [
        { id: "1", name: "Rajdhani Express", departure: "08:00", arrival: "12:00", seats: 50 },
        { id: "2", name: "Shatabdi Express", departure: "10:00", arrival: "15:00", seats: 40 },
      ],
      reservations: []
    };
    await db.write();
  }
}
initializeDB();

// API Endpoints
// 1. Get all trains
app.get('/api/trains', async (req, res) => {
  await db.read();
  res.json(db.data.trains);
});

// 2. Reserve a ticket
app.post('/api/trains/:id/reserve', async (req, res) => {
  const { name, passengerCount } = req.body;
  const trainId = req.params.id;

  await db.read();
  const train = db.data.trains.find((t) => t.id === trainId);

  if (!train) {
    return res.status(404).json({ error: "Train not found!" });
  }

  if (train.seats < passengerCount) {
    return res.status(400).json({ error: "Not enough seats available!" });
  }

  train.seats -= passengerCount;

  db.data.reservations.push({
    trainId,
    name,
    passengerCount,
    time: new Date().toISOString(),
  });

  await db.write();
  res.json({ success: true, message: "Reservation successful!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
