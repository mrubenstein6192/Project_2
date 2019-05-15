const { User } = require("../models");
const handle = require("../utils/promise-handler");

const getSearch = async (req,res) => {
  const [userErr, searchData] = await handle(User.findById(req._id, "searches"));

  if(userErr){
    return res.json(500).json(userErr);
  }

  return res.status(200).json(searchData);
};

const addSearch = async(req, res) => {
  const [userFindErr, userProfile] = await handle(User.findById(req._id));

  if(userFindErr){
    return res.status(500).json(userFindErr);
  }

  const newSearch = userProfile.searches.create({searchTerm: req.body.location});
  console.log(newSearch)
  return User.findOneAndUpdate(
    {
      _id: req._id,
      "search.location": {
        $ne: req.body.location 
      }
    },
    {
      $push: {searches : newSearch}
    },
    {
      new: true
    }
  )
    .then(userInfo => {
      if(userInfo !== null){
        return res.json(userInfo);
      }

      return res.json({
        message: "Search already saved"
      });
    })
    .catch(err => {
      console.log(err);
      return res.json(err);
    });
};

module.exports = {
  addSearch,
  getSearch
}