const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});




server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello World!';
    }
});






const init = async () => {

  try {
    await server.start();
    console.log(`server running on ${server.info.uri}`);
  } catch (err) {
    console.log("An error has occured when starting the server");
    console.log(err);
  }
};




init();
