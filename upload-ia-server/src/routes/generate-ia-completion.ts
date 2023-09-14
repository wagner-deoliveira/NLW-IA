import {FastifyInstance} from "fastify";
import {z} from "zod";
import {prisma} from "../lib/prisma";
import {openai} from "../lib/openai";
import {OpenAIStream, streamToResponse} from "ai";

export async function generateIaCompletionRoute(app: FastifyInstance) {
    app.post('/ai/complete', async (req, res) => {
        const bodySchema = z.object({
            videoId: z.string().uuid(),
            prompt: z.string(),
            temperature: z.number().min(0).max(1).default(0.5)
        })

        const {videoId, prompt, temperature} = bodySchema.parse(req.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })

        if (!video) {
            return res.status(400).send({error: 'Video transcription wasn\'t generated yet'})
        }

        const promptMessage = prompt.replace('{transcription}', video.transcription)
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            temperature,
            messages: [{role: 'user', content: promptMessage}],
            stream: true
        })

        const stream = OpenAIStream(response)
        streamToResponse(stream, res.raw, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST'
            }
        })
    })
}
