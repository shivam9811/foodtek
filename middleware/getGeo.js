const axios = require("axios");

module.exports.getGeo = async (address) => {
  const { data } = await axios.get("http://api.positionstack.com/v1/forward", {
    params: { access_key: process.env.GEO_TOKEN, query: address },
  });
  const { latitude, longitude } = data.data[0];
  const geoLocation = +latitude + "," + +longitude;
  //   console.log(geoLocation);
  return geoLocation;
};
