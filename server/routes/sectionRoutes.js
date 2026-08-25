import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Section API is ready for implementation.",
    data: [],
  });
});

export default router;