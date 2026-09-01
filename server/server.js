const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Pearl 27 Support API is running",
  });
});

app.post("/api/tickets", upload.single("screenshot"), (req, res) => {
  const { name, email, title, description } = req.body;

  if (!name || !email || !title || !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  const ticketId = `TKT-${Date.now()}`;

  console.log("New support ticket:", {
    ticketId,
    name,
    email,
    title,
    description,
    file: req.file
      ? {
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
        }
      : null,
  });

  res.status(201).json({
    success: true,
    message: "Support request submitted successfully.",
    ticketId,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
