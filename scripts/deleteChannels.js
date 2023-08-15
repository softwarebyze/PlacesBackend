import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
dotenv.config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);

const deleteChannels = async (client, filter) => {
  try {
    if (!filter.type)
      throw new Error(
        "Filter Type is required: \n Enter it as an argument after the file name"
      );
    const channels = await client.queryChannels(filter);
    channels.map((channel) => {
      console.log(channel.cid);
      return channel.delete();
    });
  } catch (error) {
    console.error(error.message);
  }
};

deleteChannels(serverClient, { type: process.argv[2] });
