const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { server } = require("./server.js");

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
    id: "8cbdd2b0-7055-40d3-8f2d-ba9b38fb3e1e",
    type: "ON_DEMAND",
    priceInPence: "10000",
    contactEmail: "test@test.com",
    status: "ASSIGNED",
    createdAt: new Date("2019-06-01").toISOString(),
    updatedAt: null,
  },
];

//Create new job
server.route({
  method: "POST",
  path: "/jobs/",
  handler: (request, h) => {
    // Validate request

    const jobSchema = Joi.object({
      type: Joi.string().valid("ON_DEMAND", "SHIFT", "SCHEDULED").required(),
      priceInPence: Joi.number().positive().required(),
      contactEmail: Joi.string().email().optional().optional(),
      status: Joi.string()
        .valid("AVAILABLE", "ASSIGNED", "COMPLETED")
        .required(),
    });

    // Handle error
    const { error } = jobSchema.validate(request.payload);
    if (error) return h.response(error.message).code(400);

    // Create the new job
    const newJob = {
      id: uuidv4(),
      type: request.payload.type,
      priceInPence: request.payload.priceInPence,
      contactEmail: request.payload.contactEmail,
      status: request.payload.status,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    // append to existing jobs
    jobs.push(newJob);

    return JSON.stringify(newJob);
  },
});

//Get Job By Id
server.route({
  method: "GET",
  path: "/jobs/{id}",
  handler: (request, h) => {
    // find the job
    const job = jobs.find((job) => job.id === request.params.id);

    // handle job not found
    if (job === undefined)
      return h.response("No Job With This ID Was Found").code(404);

    return JSON.stringify(job);
  },
});

//Update Job
server.route({
  method: "PATCH",
  path: "/jobs/{id}",
  handler: (request, h) => {
    // validate incoming request

    const jobUpdateSchema = Joi.object({
      contactEmail: Joi.string().email().optional(),
      status: Joi.string()
        .valid("AVAILABLE", "ASSIGNED", "COMPLETED")
        .required(),
    });
    const { error } = jobUpdateSchema.validate(request.payload);

    if (error) return h.response(error.message).code(400);

    const job = jobs.find((job) => job.id === request.params.id);
    // handle job not found
    if (job === undefined)
      return h.response("No Job With This ID Was Found").code(404);

    // Update the job
    job.contactEmail = request.payload.contactEmail;
    job.status = request.payload.status;
    job.updatedAt = new Date().toISOString();

    return JSON.stringify(job);
  },
});

//Delete job
server.route({
  method: "DELETE",
  path: "/jobs/{id}",
  handler: (request, h) => {
    // find the job
    const job = jobs.find((job) => job.id === request.params.id);

    // handle job not found
    if (job === undefined)
      return h.response("No Job With This ID Was Found").code(404);

    // Remove the deleted job from the jobs array
    jobs = jobs.filter((job) => {
      return job.id != request.params.id;
    });

    return jobs;
  },
});

// Get All Jobs...
server.route({
  method: "GET",
  path: "/jobs/",
  handler: (request, h) => {
    // sort array, new jobs first
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return jobs;
  },
});

exports.jobs = jobs;
