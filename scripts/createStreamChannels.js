import fs from "fs";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const createStreamChannels = async (client, location, dataArray) => {
  try {
    if (!location)
      throw new Error(
        "Location is required \n enter is as an argument after the file name"
      );
    await dataArray.map(async ({ Interest, Category, LinkURL }) => {
      try {
        const channel = client.channel("team", uuidv4(), {
          interest: Interest,
          category: Category,
          location: location,
          name: Interest + " / " + location,
          image: LinkURL,
          created_by_id: "avraham_s",
        });
        await channel.create();
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const interests = JSON.parse(fs.readFileSync("../interests.json", "utf8"));

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);

for (let i = 2; i < process.argv.length; i++)
  createStreamChannels(serverClient, process.argv[i], interests);
