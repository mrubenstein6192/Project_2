const axios = require("axios") 
const handle = require('../utils/promise-handler');

const flight_status = async (req, res) => {
  const { carrier ,flightNum ,flightDate}= req.query;
  
  const [err,{data}] = await handle(axios.get("https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/" + carrier + "/"+ flightNum + "/arr/" + flightDate + "?appId=81188cad&appKey=39caf475c4c198e8f70ec33023ecc538&utc=false"))
  if (err) {
    console.log(err);
    return res.status(500).json(err);
  }
  return res.status(200).json(data);
}


module.exports = {
  flight_status
}
