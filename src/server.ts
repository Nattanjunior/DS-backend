import { fastify } from "fastify";

const app = fastify();

const port = 3000;

const logger = fastify({
  logger: true,
});

app.listen({ port }, () => {
  console.log(`Server is running on port ${port}`);
});
