import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt:'asc',
      },
    })
    return memories.map(memory => {
      return {
        id:memory.id,
        coverUrl: memory.coverUrl,
        execerpt: memory.content.substring(0, 115).concat('...')
      }
    })
  })
  
    app.get('/memories/:id', async (request) => {
      const paramsSchema = z.object({
        id: z.string().uuid() 
      })

      const{ id } = paramsSchema.parse(request.params)

      const memory = await prisma.memory.findUniqueOrThrow({
        where: {
          id,
        },
      })
      return memory
    })
  
    app.post('/memories', async (request) => {
      const bodySchema = z.object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false)
    })

    const{ content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
        data: {
          content,
          coverUrl,
          isPublic,
          userId:'b1795b81-6a0b-4e88-ab6c-89fdec615861',
        },
    })
    return memory;
})

    app.put('/memories/:id', async (request) => {
      const paramsSchema = z.object({
        id: z.string().uuid() 
      })
      const{ id } = paramsSchema.parse(request.params)

      const bodySchema = z.object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false)
    })

    const{ content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic
      }
    })

    return memory
})
    
   
     app.delete('/memories/:id', async (request) => {
      const paramsSchema = z.object({
        id: z.string().uuid() 
      })

      const{ id } = paramsSchema.parse(request.params)

      const memory = await prisma.memory.delete({
        where: {
          id,
        },
      })
      return memory
    })
  }
  


