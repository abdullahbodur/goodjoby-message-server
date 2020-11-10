const jwt = require("jsonwebtoken");
const { userControl } = require("../../controllers/user");
const { sendStatus } = require("../socketHelpers/socketHelper");
// == == == == == == == == == == == == == == == == == == == ==
//  LOGIN TOKEN CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const loginTokenControl = async (token, client) => {
  const { JWT_SECRET_KEY } = process.env;

  if (!(token && token.startsWith("Bearer:"))) {
    sendStatus(client, {
      message: "Token is invalid",
      status_code: 401,
    });
    return undefined;
  }

  token = token.split(" ")[1];

  await jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      client.token = undefined;

      // change status emit-code to error
      sendStatus(client, {
        message: "Token is invalid",
        status_code: 401,
      });
      client.disconnect();
    } else {
      // decoded token
      token = {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
      };

      try {
        if (await usersControl(token)) {
          client.token = token;
          sendStatus(client, {
            message: "Login is successfuly",
            status_code: 200,
          });
        } else {
          console.log("vll");
          client.token = undefined;
          sendStatus(client, {
            message: "Token is invalid",
            status_code: 401,
          });
          client.disconnect();
        }
      } catch (error) {
        throw err;
      }
    }
  });

  return client;
};

// == == == == == == == == == == == == == == == == == == == ==
//  OTHER SIDE CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const toTokenControl = async (token, client) => {
  const { JWT_SECRET_KEY } = process.env;
  let result = undefined;

  if (!(token && token.startsWith("Bearer:"))) {
    sendStatus(client, {
      message: "Token is invalid",
      status_code: 401,
    });
    return result;
  }

  token = token.split(" ")[1];

  await jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      sendStatus(client, {
        message: "Control is not successfuly",
        status_code: 400,
      });
      throw err;
    } else {
      // decoded token
      token = {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
      };

      // token user control
      if (!(await usersControl(token))) {
        sendStatus(client, {
          message: "Control is not successfuly",
          status_code: 400,
        });
      } else {
        sendStatus(client, {
          message: "Control is successfuly",
          status_code: 200,
        });
        result = token;
      }
    }
  });

  return result;
};

// == == == == == == == == == == == == == == == == == == == ==
//  USERS CONTROL FROM DATABASE
// == == == == == == == == == == == == == == == == == == == ==

const usersControl = async (token) => {
  return userControl(token.role, token.id)
    .then((val) => (val ? true : false))
    .catch((err) => console.error(err));
};

module.exports = { loginTokenControl, toTokenControl };
