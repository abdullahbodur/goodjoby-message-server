const { getChats } = require("../../controllers/chat");
// == == == == == == == == == == == == == == == == == == == ==
//  JOIN ROOM
// == == == == == == == == == == == == == == == == == == == ==
 
const joinRoom = (client, toToken) => {
  const token = client.token;

  const arr = [`${token.role}:${token.id}`, `${toToken.role}:${toToken.id}`]
    .sort()
    .join("-");
  channelName = arr.toString();
  client.join(channelName);
  client.token.channelName = channelName;
  return client;
};

// == == == == == == == == == == == == == == == == == == == ==
//  PUSH MESSAGES - LOGIN USER
// == == == == == == == == == == == == == == == == == == == ==

const pushMessages = async (chats, client) => {
  let ownChats = {};
  client.token.rooms = [];
  for (let chat_ssid in chats) {
    if (chats.hasOwnProperty(chat_ssid)) { 
      if (chat_ssid.includes(client.token.role + ":" + client.token.id)) {
        // join room
        client.join(chat_ssid);

        // add chat_ssid to array which client is inside
        ownChats[chat_ssid] = chats[chat_ssid];
 
        // push this chat_ssid to client object
        client.token.rooms.push(chat_ssid);

        client.to(chat_ssid).emit("online", {
          user_id: client.token.id,
          room_id: chat_ssid,
          online: true,
        });
      }
    }
  }


  client.emit("f-message", ownChats);
};

// == == == == == == == == == == == == == == == == == == == ==
//  SEND STATUS
// == == == == == == == == == == == == == == == == == == == ==

const sendStatus = (client, message) => {
  return client.emit("status", message);
};

// == == == == == == == == == == == == == == == == == == == ==
//  SEND OFFLINE STATUS TO ROOM
// == == == == == == == == == == == == == == == == == == == ==

const sendOfflineInfo = (client, io) => {
  if (client.token) {
    if (client.token.hasOwnProperty("rooms")) {
      for (let i = 0; i < client.token.rooms; i++) { 
        io.to(rooms[i]).emit("online", {
          user_id: client.token.id,
          room_id: rooms[i],
          online: false,
        });
      }
    }
  }
};

module.exports = {
  joinRoom,
  pushMessages,
  sendStatus,
  sendOfflineInfo,
};

