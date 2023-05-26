import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function postRoutes(app: FastifyInstance) {
  app.get('/posts', async (request) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    })

    return posts
  })
  app.post('/posts', async (request) => {
    const bodySchema = z.object({
      title: z.string(),
      content: z.string(),
      imageUrl: z.string(),
      email: z.string(),
    })

    const { content, imageUrl, title, email } = bodySchema.parse(request.body)

    const getUser = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    })

    const createPost = await prisma.post.create({
      data: {
        content,
        imageUrl,
        title,
        userId: getUser.id,
      },
    })

    return createPost
  })
}
