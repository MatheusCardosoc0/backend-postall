import fastify from 'fastify'
import { authRoutes } from './routes/auth'
import cors from '@fastify/cors'
import { postRoutes } from './routes/posts'

const app = fastify()
app.register(authRoutes)
app.register(postRoutes)

app.register(cors, {
  origin: true,
})

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log('server is running in port http://localhost:3333'))
