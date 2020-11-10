const Chat = require("../models/Chat");

const createChat = async (cht) => {
  try {
    const chat = await Chat.create(cht);
    return chat;
  } catch (error) {
    throw error;
  }
};

const getChats = async (token) => {
  try {
    const query = token.role + ":" + token.id;
    const regex = new RegExp(query, "i");

    const chats = await Chat.find(
      {
        room_ssid: { $regex: regex },
      },
      { messages: { $slice: [20, 10] } }
    );

    return chats;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createChat, getChats };
