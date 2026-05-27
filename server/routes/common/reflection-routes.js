const express = require("express");
const {
  createReflection,
  publishReflection,
  editReflection,
  deleteReflection,
  getAllReflections,
  getPublishedReflections,
  getReflectionById,
  addComment,
  subscribe,
  unsubscribe,
} = require("../../controllers/common/reflection-controller");

const router = express.Router();

// Admin
router.post("/admin/create", createReflection);
router.put("/admin/publish/:id", publishReflection);
router.put("/admin/edit/:id", editReflection);
router.delete("/admin/delete/:id", deleteReflection);
router.get("/admin/all", getAllReflections);

// Público
router.get("/published", getPublishedReflections);
router.get("/:id", getReflectionById);
router.post("/comment/:id", addComment);
router.post("/subscribe", subscribe);
router.get("/unsubscribe/:email", unsubscribe);

module.exports = router;
