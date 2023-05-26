"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var import_fastify = __toESM(require("fastify"));

// src/routes/auth.ts
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/auth.ts
function authRoutes(app2) {
  return __async(this, null, function* () {
    app2.post("/register", (request) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        name: import_zod.z.string(),
        email: import_zod.z.string(),
        image: import_zod.z.string().url()
      });
      const { email, image, name } = bodySchema.parse(request.body);
      let user = yield prisma.user.findUnique({
        where: {
          email
        }
      });
      if (!user) {
        user = yield prisma.user.create({
          data: {
            email,
            image,
            name
          }
        });
      }
    }));
  });
}

// src/server.ts
var import_cors = __toESM(require("@fastify/cors"));

// src/routes/posts.ts
var import_zod2 = require("zod");
function postRoutes(app2) {
  return __async(this, null, function* () {
    app2.get("/posts", (request) => __async(this, null, function* () {
      const posts = yield prisma.post.findMany({
        orderBy: {
          createdAt: "desc"
        },
        include: {
          user: true
        }
      });
      return posts;
    }));
    app2.post("/posts", (request) => __async(this, null, function* () {
      const bodySchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        content: import_zod2.z.string(),
        imageUrl: import_zod2.z.string(),
        email: import_zod2.z.string()
      });
      const { content, imageUrl, title, email } = bodySchema.parse(request.body);
      const getUser = yield prisma.user.findUniqueOrThrow({
        where: {
          email
        }
      });
      const createPost = yield prisma.post.create({
        data: {
          content,
          imageUrl,
          title,
          userId: getUser.id
        }
      });
      return createPost;
    }));
  });
}

// src/server.ts
var app = (0, import_fastify.default)();
app.register(authRoutes);
app.register(postRoutes);
app.register(import_cors.default, {
  origin: true
});
var _a;
app.listen({
  port: (_a = process.env.PORT) != null ? _a : 3333
}).then(() => console.log("server is running in port http://localhost:3333"));
