// Import the framework and instantiate it
import Fastify from "fastify";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const port = process.env.PORT || 8080;
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

// Define values.
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
// const user_id = "john";

// Declare a route
fastify.get("/:id", async function handler(request, reply) {
  // Initialize a Server Client
  const serverClient = StreamChat.getInstance(api_key, api_secret);
  // Create User Token
  const token = serverClient.createToken(request.params.id);
  return { token };
});

fastify.post("/update/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const { details, token } = request.body;
    const serverClient = StreamChat.getInstance(api_key, api_secret);
    const user = await serverClient.connectUser({ id, ...details }, token);
    return { user };
  } catch (error) {
    return { error };
  }
});

// Run the server!
try {
  await fastify.listen({ host, port });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
