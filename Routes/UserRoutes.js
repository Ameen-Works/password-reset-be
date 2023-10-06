const express = require("express");
const {
  addUser,
  resetPassword,
  allUsers,
  validateResetPasswordLink,
  acceptUser,
  updateUserPassword,
} = require("../Controllers/Actions");
const { verifyToken } = require("../JWT");
const router = express.Router();

router.get("/users", allUsers);
router.post("/addUser", addUser);
router.post("/reset-password", resetPassword);
router.get("/validate-reset-link", validateResetPasswordLink);
router.post("/login", acceptUser);
router.post("/update-password", updateUserPassword);

module.exports = router;
