const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});

// Initalize the  server, used in testing
init = async () => {
  try {
    await server.initialize();
    console.log(`server intialized`);
    return server;
  } catch (err) {
    console.log("An error has occured when starting the server");
    console.log(err);
  }
};

start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

exports.server = server;
exports.init = init;
exports.start = start;
