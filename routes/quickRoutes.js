const express = require("express");
const router = express.Router();
router
  .get("/about", (req, res) => res.render("quick-links/about"))
  .get("/contact", (req, res) => res.render("quick-links/contact"))
  .get("/cookie-policy", (req, res) => res.render("quick-links/cookie-policy"))
  .get("/faq", (req, res) => res.render("quick-links/faq"))
  .get("/help", (req, res) => res.render("quick-links/help"))
  .get("/privacy-policy", (req, res) => res.render("quick-links/privacy-policy"))
  .get("/report", (req, res) => res.render("quick-links/report"))
  .get("/rules", (req, res) => res.render("quick-links/rules"))
  .get("/terms-of-service", (req, res) => res.render("quick-links/tos"));

module.exports = router;
