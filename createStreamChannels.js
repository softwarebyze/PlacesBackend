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

const interests = JSON.parse(fs.readFileSync("interests.json", "utf8"));

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
  // "Petah Tikva, Israel",
  // "Ramat Gan, Israel",
  // "Tzfat, Israel",
  // "Netanya, Israel",
  // "Rosh Ha'Ayin , Israel",
  // "Rishon Lezion, Israel",
  // "Berkeley, CA",
  "Kansas City, KS",
  // "Givatayim, Israel",
  // "Bat Yam, Israel",
];

cities.map(async (city) => {
  // BATCH CREATING:
  const startAtIndex = 0;
  const numberToCreate = interests.length - startAtIndex;
  const waitTime = 500;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = startAtIndex; i < startAtIndex + numberToCreate; i++) {
    console.log("adding " + i + " out of " + interests.length);
    console.log(JSON.stringify(interests[i]));
    await createStreamChannel(serverClient, city, interests[i]);
    console.log("waiting");
    await wait(waitTime);
    console.log("done waiting");
  }

  console.log(`DONE with ${city}`);
});

const client = serverClient;

const response = await client.queryChannels(
  {
    // member_count: 2,
    // members: {
    //   $eq: [client.userID, actionsParams.message.user.id],
    // },
  },
  undefined,
  {
    limit: 100,
  }
);

// console.log("response: ", response);
console.log("count: ", response.length);
const channelsData = response.map((c) => c.data);
const locationsWithChats = channelsData.map((c) => c.location);
const uniqueLocations = [...new Set(locationsWithChats)];
console.log(uniqueLocations);
