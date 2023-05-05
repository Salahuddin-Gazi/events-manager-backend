"use strict";

/**
 * event controller
 */

const { parseMultipartData } = require("@strapi/utils");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // get events by user
  async me(ctx) {
    // console.log(ctx.is("multipart"));
    const user = ctx.state.user;
    // const { query } = ctx;
    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }
    const query = {
      populate: ["User", "Image"],
      filters: { User: { id: user.id } },
    };

    const data = await strapi.service("api::event.event").find(query);
    // console.log(data);
    // const { results, pagination } = data;
    // if (!results) {
    if (!data) {
      return ctx.notFound();
    }

    // const sanitizeResults = await this.sanitizeOutput(results, ctx);
    const sanitizeResults = await this.sanitizeOutput(data, ctx);

    return this.transformResponse(sanitizeResults);
  },

  // create event
  async create(ctx) {
    const user = ctx.state.user;
    const { data } = ctx.request.body;
    const image = ctx.request.files ? ctx.request.files : null;

    // console.log(ctx.request.files);
    // console.log(ctx.request.body);
    // console.log("===========**==========");
    // console.log(user);
    // console.log("===========**==========");
    // console.log(data);
    // console.log("===========**==========");
    // console.log(files);
    // console.log("===========**==========");

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    data.User = user.id;

    const info = image ? { data, files: { Image: image.files } } : { data };

    const entity = await strapi.service("api::event.event").create(info);

    const sanitizeResults = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizeResults);
  },

  // update event
  async update(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const { data } = ctx.request.body;
    const image = ctx.request.files ? ctx.request.files : null;
    // const { query } = ctx;
    // console.log(query.filters["$and"][1]);

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }
    // prettier-ignore
    const eventsQuery = {
          filters: {
            $and: [
              { id: { $eq: id, }, }, 
              { User: { id: { $eq: user.id, }, }, },
            ],
          },
        };

    const { results } = await strapi
      .service("api::event.event")
      .find(eventsQuery);
    // console.log(results);

    if (results.length === 0) {
      return ctx.unauthorized(`You are not authrized!`);
    }

    const info = image ? { data, files: { Image: image.files } } : { data };

    const entity = await strapi.service("api::event.event").update(id, info);

    const sanitizeResults = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizeResults);
  },

  // delete
  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    // prettier-ignore
    const eventsQuery = {
      filters: {
        $and: [
          { id: { $eq: id, }, }, 
          { User: { id: { $eq: user.id, }, }, },
        ],
      },
    };

    const { results } = await strapi
      .service("api::event.event")
      .find(eventsQuery);
    console.log(results);
    if (results.length === 0) {
      return ctx.unauthorized(`You are not authrized!`);
    }

    const entity = await strapi.service("api::event.event").delete(id);

    const sanitizeResults = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizeResults);
  },
}));
