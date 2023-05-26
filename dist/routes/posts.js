"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/posts.ts
var posts_exports = {};
__export(posts_exports, {
  postRoutes: () => postRoutes
});
module.exports = __toCommonJS(posts_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/posts.ts
var import_zod = require("zod");
async function postRoutes(app) {
  app.get("/posts", async (request) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: true
      }
    });
    return posts;
  });
  app.post("/posts", async (request) => {
    const bodySchema = import_zod.z.object({
      title: import_zod.z.string(),
      content: import_zod.z.string(),
      imageUrl: import_zod.z.string(),
      email: import_zod.z.string()
    });
    const { content, imageUrl, title, email } = bodySchema.parse(request.body);
    const getUser = await prisma.user.findUniqueOrThrow({
      where: {
        email
      }
    });
    const createPost = await prisma.post.create({
      data: {
        content,
        imageUrl,
        title,
        userId: getUser.id
      }
    });
    return createPost;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  postRoutes
});
