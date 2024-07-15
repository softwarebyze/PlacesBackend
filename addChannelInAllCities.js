import fs from "fs";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const createStreamChannel = async (
  client,
  location,
  channelData,
  channelType = "team",
  createdById = "zackebenfeld"
) => {
  const { interest, category, image } = channelData;

  const channel = client.channel(channelType, uuidv4(), {
    interest,
    category,
    location,
    name: interest + " / " + location,
    image,
    created_by_id: createdById,
  });
  await channel.create();
  console.log(`Channel created!`);
};

const newInterests = JSON.parse(fs.readFileSync("newInterests.json", "utf8"));

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);

// CREATING ONE TEST INTEREST:
// const testInterest = {
//   interest: "Test",
//   category: "Services",
//   image:
//     "https://static.wixstatic.com/media/5248d9_e0358655430f4032ac7010f09fa4df7a~mv2.png/v1/fill/w_116,h_144,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/5248d9_e0358655430f4032ac7010f09fa4df7a~mv2.png",
// };
// await createStreamChannel(serverClient, city, testInterest);
// console.log("DONE");

const cities = [
  "Parkland, FL",
  "Kfar Saba, Israel",
  "Los Angeles, CA",
  "Boca Raton, FL",
  "Eilat, Israel",
  "Dallas, TX",
  "Cupertino, CA",
  "Tel Aviv, Israel",
  "Gainesville, FL",
  "Pembroke Pines, FL",
  "Pompano Beach, FL",
  "Be'er Sheva, Israel",
  "Herzilya, Israel",
  "Jerusalem, Israel",
  "New York City, NY",
  "Haifa, Israel",
  "Bet Shemesh, Israel",
  "Ra'anana, Israel",
  "Yafo, Israel",
];

cities.map(async (city) => {
  // BATCH CREATING:
  const waitTime = 5000;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < newInterests.length; i++) {
    console.log("adding " + i + " out of " + newInterests.length);
    console.log(JSON.stringify(newInterests[i]));
    await createStreamChannel(serverClient, city, newInterests[i]);
    console.log("waiting");
    await wait(waitTime);
    console.log("done waiting");
  }

  console.log(`DONE with ${city}`);
});

const client = serverClient;

const response = await client.queryChannels(
  {
  },
  undefined,
  {
    limit: 100,
  }
);

console.log("count: ", response.length);
const channelsData = response.map((c) => c.data);
const locationsWithChats = channelsData.map((c) => c.location);
const uniqueLocations = [...new Set(locationsWithChats)];
console.log(uniqueLocations);
