// == == == == == == == == == == == == == == == == == == == ==
// INPUT CONTROL 
// == == == == == == == == == == == == == == == == == == == ==

const inputControl = (token) => {
  return token;
};


const getTokenFromData = (token) =>{
    return token.split(" ")[1]
}
  


module.exports = {
  inputControl,
  getTokenFromData
};
