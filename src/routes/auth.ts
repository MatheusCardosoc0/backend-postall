import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      image: z.string().url(),
    })

    const { email, image, name } = bodySchema.parse(request.body)

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          image,
          name,
        },
      })
    }
  })
}
