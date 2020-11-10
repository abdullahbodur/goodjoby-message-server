const { createChat } = require("../../controllers/chat");
const { sendStatus } = require("../socketHelpers/socketHelper");

// const mergeTwoChatObject = (chat) => {
//   if (chat.messages.length > 20) {
//     chat.messages.splice(0, chat.messages.length - 20);
//   }
//   return chat;
// };

const createAndPushChat = async (chat,chats, client) => {
  try {
    const cht = await createChat(chat);
    if (!cht) {
      sendStatus(client, {
        message: "This room already exists",
        status_code: 400,
      });
    }
    chats[cht.room_ssid] = cht;
    client.emit("g-chat", cht);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAndPushChat,
};
