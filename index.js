// Import the framework and instantiate it
import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

const port = process.env.PORT || 8080;

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

// Run the server!
try {
  await fastify.listen({ host: "0.0.0.0", port });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
