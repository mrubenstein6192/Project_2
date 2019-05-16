const router = require('express').Router();

const {
  getSearch,
  addSearch
} = require("../../controllers/search-controllers");

const withAuth = require("../../middleware/authentication");

router.use(withAuth);

router
  .route("/")
  .get(getSearch)
  .post(addSearch);

module.exports = router;