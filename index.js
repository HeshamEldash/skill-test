const Hapi = require("@hapi/hapi");
const Joi = require("joi");

// ## Job Entity

//id: required, string. must be a valid UUID (v4).
// type: required, string. must be one of 'ON_DEMAND', 'SHIFT' or 'SCHEDULED'.
// priceInPence: required, integer. can be zero, but cannot be negative.

// contactEmail: optional, string. must be a valid email if provided.
// status: required, string. must be one of 'AVAILABLE', 'ASSIGNED' or 'COMPLETED'.

// createdAt: required, string. must be a valid date in ISO 8601 format. automatically set when a Job entity is created.
// updatedAt: optional, string. must be a valid date in ISO 8601 format. defaults to null, automatically set whenever a Job entity is updated.

let jobs = [
  {
    id: "8cbdd2b0-7055-40d3-8f2d-ba9b38fb3d1e",
    type: "ON_DEMAND",
    priceInPence: "10000",
    contactEmail: "test@test.com",
    status: "ASSIGNED",
    createdAt: new Date("2020-06-01").toISOString(),
    updatedAt: null,
  },
  {
    id: "8cbdd2b0-7055-40d3-8f2d-ba9b38fb3d1e",
    type: "ON_DEMAND",
    priceInPence: "10000",
    contactEmail: "test@test.com",
    status: "ASSIGNED",
    createdAt: new Date("2019-06-01").toISOString(),
    updatedAt: null,
  },
];

const jobSchema = Joi.object({
  id: Joi.string().guid({
    version: "uuidv4",
  }),
  type: Joi.string().valid("ON_DEMAND", "SHIFT", "SCHEDULED"),
  priceInPence: Joi.number().positive(),
  contactEmail: Joi.string().email().optional(),
  status: Joi.string().valid("AVAILABLE", "ASSIGNED", "COMPLETED"),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso().optional().default(null),
});

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});


//Get Job By Id
server.route({
  method: "GET",
  path: "/jobs/{id}",
  handler: (request, h) => {

    // find the job 
    const job = jobs.find(job => job.id === request.params.id)
    console.log(request.params.id)

    // handle job not found
    if (job === undefined) return h.response("No Job With This ID Was Found").code(404)
    
    return job;
  },
})

// Get All Jobs...
server.route({
  method: "GET",
  path: "/jobs",
  handler: (request, h) => {
    // sort array, new jobs first
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return jobs;
  },
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

//TODO 1: **Endpoint**: `/jobs/{id} - GET`
// This endpoint should return a single Job, matching by the ID specified as a route parameter.

//TODO 2: ### Update Job by ID
// **Endpoint**: `/jobs/{id} - PATCH`
// This endpoint should parse incoming JSON data and update an existing Job entity, returning it in the response.
// The incoming JSON payload should be as follows:
// ```
// contactEmail: optional, string. must be a valid email if provided.
// status: required, string. must be one of 'AVAILABLE', 'ASSIGNED' or 'COMPLETED'.
// ```
// Only the `contactEmail` and `status` attributes can be updated. The `updatedAt` should be updated if an update takes place.

//TODO 3 : ### Delete Job by ID
// **Endpoint**: `/jobs/{id} - DELETE`
// This endpoint should delete a Job from the in-memory store, matching by the ID specified as a route parameter.
