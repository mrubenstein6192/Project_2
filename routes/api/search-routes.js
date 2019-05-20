const router = require('express').Router();

const { flight_status } = require('../../controllers/flight-status');

const {
  getSearch,
  addSearch
} = require("../../controllers/search-controllers");

const withAuth = require("../../middleware/authentication");


router
  .route("/")
  .get(withAuth, getSearch)
  .post(withAuth, addSearch);

router
.route('/flights')
.get(flight_status);


module.exports = router;