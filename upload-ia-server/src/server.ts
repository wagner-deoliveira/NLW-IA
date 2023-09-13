import {fastify} from "fastify";
import {getAllPromptsRoute} from "./routes/get-all-prompts";
import {uploadVideoRoute} from "./routes/upload-video";
import {createTranscriptionRoute} from "./routes/create-transcription";
import {generateIaCompletionRoute} from "./routes/generate-ia-completion";
import {fastifyCors} from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
    origin: '*'
})
app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateIaCompletionRoute);
app.listen({
    port: 42069
}).then(() => {
    console.log('Server running')
})