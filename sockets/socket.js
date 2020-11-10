const {
  loginTokenControl,
  toTokenControl,
} = require("../helper/token/tokenControl");
const {
  joinRoom,
  sendStatus,
  pushMessages,
  sendOfflineInfo,
} = require("../helper/socketHelpers/socketHelper");

const { createAndPushChat } = require("../helper/chatHelper/chatHelper");

const capitalize = (s) => {
  if(typeof s != "string") throw Error("Role is not string or undefined")
  return s.charAt(0).toUpperCase() + s.slice(1) 
}

// == == == == == == == == == == == == == == == == == == == ==
//  SOCKET CONNECTION
// == == == == == == == == == == == == == == == == == == == ==

const connectSocketIO = (app) => {
  const server = require("http").createServer(app);
  const io = require("socket.io").listen(server);

  const connectedUsers = {};
  const chats = {};



  // == == == == == == == == == == == == == == == == == == == ==
  //  CLIENT CONNECTION 
  // == == == == == == == == == == == == == == == == == == == ==

  io.on("connection", async (client) => {
    // == == == == == == == == == == == == == == == == == == == ==
    //  CLIENT LOGIN CONTROL
    // == == == == == == == == == == == == == == == == == == == ==

    client.on("login", async (token) => {
      client = await loginTokenControl(token, client);
      if (!client.token) return;
      connectedUsers[client.token.role + ":" + client.token.id] = client;
      pushMessages(chats, client);
    });  

    // == == == == == == == == == == == == == == == == == == == ==
    //  CLIENT CREATE A ROOM - AND JOIN
    // == == == == == == == == == == == == == == == == == == == ==

    client.on("join", async (token) => {
      token = await toTokenControl(token, client);
      let chat ;
      if (token) {
        // client join room
        client = joinRoom(client, token);

        const channelName = client.token.channelName;

        // add new Chat Object to chats
        if (!chats.hasOwnProperty(channelName)) {
          console.log(client.token,token)
          chat = {
            room_ssid: channelName,
            messages: [],
            documents: [],
            users: [
              {
                user: client.token.id, 
                user_path: capitalize(client.token.role)
              },
              {
                user: token.id,
                user_path: capitalize(token.role)
              },
            ],
          };
          await createAndPushChat(chat, chats, client);
        } else {
          // add client to this object
        }

        // if other side is online => send new Room

        const otherSide = token.role + ":" + token.id;
        console.log(Object.keys(connectedUsers).length)

        if (connectedUsers.hasOwnProperty(otherSide)) {
          // other side online
          connectedUsers[otherSide].join(channelName); 
          connectedUsers[otherSide].emit("g-chat", chat);
        }
        console.log(io.sockets)
      }
    });

    // == == == == == == == == == == == == == == == == == == == ==
    //  CLIENT SEND MESSAGE
    // == == == == == == == == == == == == == == == == == == == ==

    client.on("s-message", async (message) => {
      /* {
        room_ssid : ********
        from : *****
        to : ******
        from_path : *****
        to_path : ******
        message : ******
        createdAt : date.now();
      }*/

      if (
        chats.hasOwnProperty(message.room_ssid)
        /* && chats.filter((e) => e.users.includes(message.from)) && chats.filter((e) => e.users.includes(message.to))*/
      ) {
        message["createdAt"] = Date(Date.now());
        message.from_path = capitalize(message.from_path);
        message.to_path = capitalize(message.to_path);

        // push message to chats object
        chats[message.room_ssid].messages.push(message);
        await chats[message.room_ssid].save();

        io.in(message.room_ssid).emit("g-message", message);

        if (
          !connectedUsers.hasOwnProperty(
            message.to_path.toLowerCase() + ":" + message.to
          )
        ) {
          // if Other Side (to) offline
          // Push Notification
        }
      } else {
        sendStatus(client, {
          message: "There is no chat room with that id",
          status_code: 400,
        });
      }
    });

    // == == == == == == == == == == == == == == == == == == == ==
    //  CLIENT DISCONNECT
    // == == == == == == == == == == == == == == == == == == == ==

    client.on("disconnect", () => {
      // send info to the room which client is inside
      sendOfflineInfo(client, io);
    });
  });

  return server;
};

module.exports = connectSocketIO;
