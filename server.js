const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATES_FILE = path.join(__dirname, "dates.json");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Helper to read dates from file
function readDatesFromFile() {
  try {
    if (!fs.existsSync(DATES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATES_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading dates file:", error);
    return [];
  }
}

// Helper to write dates to file
function writeDatesToFile(dates) {
  try {
    fs.writeFileSync(DATES_FILE, JSON.stringify(dates, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing dates file:", error);
    return false;
  }
}

// API: Save date selection
app.post("/api/save-date", (req, res) => {
  const { name, date, time, location, food, message } = req.body;

  if (!date || !time) {
    return res
      .status(400)
      .json({ success: false, error: "Vui lòng chọn ngày và giờ nhé!" });
  }

  const dates = readDatesFromFile();
  const newDateRecord = {
    id: Date.now().toString(),
    name: name || "Khánh Huyền",
    date,
    time,
    location: location || "Chưa chọn",
    food: food || "Chưa chọn",
    message: message || "",
    createdAt: new Date().toISOString(),
  };

  dates.push(newDateRecord);
  const success = writeDatesToFile(dates);

  if (success) {
    res.json({ success: true, data: newDateRecord });
  } else {
    res
      .status(500)
      .json({
        success: false,
        error: "Không thể lưu lịch hẹn, vui lòng thử lại!",
      });
  }
});

// API: Get all dates (for admin panel)
app.get("/api/dates", (req, res) => {
  const dates = readDatesFromFile();
  // Sort by newest created first
  dates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, data: dates });
});

// Start the server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`💖 Web Date Plan Maker đang chạy thành công!`);
  console.log(`🔗 Địa chỉ: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
