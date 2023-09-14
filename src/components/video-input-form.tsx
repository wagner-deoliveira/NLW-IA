import {FileVideo, Upload} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChangeEvent, FormEvent, useMemo, useRef, useState} from "react";
import {getFFmpeg} from "@/lib/ffmpeg.ts";
import {fetchFile} from "@ffmpeg/util";
import {api} from "@/lib/axios.ts";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'
const statusMessages = {
    converting: 'Converting...',
    generating: 'Generating...',
    uploading: 'Uploading...',
    success: 'Success!'

}

interface VideoInputFormProps {
    onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>('waiting')
    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const {files} = event.currentTarget

        if (!files) {
            return
        }

        const selectedFile = files[0]

        setVideoFile(selectedFile)
    }


    async function convertVideoToAudio(video: File) {
        const ffmeg = await getFFmpeg()
        await ffmeg.writeFile('input.mp4', await fetchFile(video))
        ffmeg.on('log', log => {
            console.log(log)
        })

        ffmeg.on('progress', progress => {
            console.log('Convert progress: ' + Math.round((progress.progress * 100)))
        })

        await ffmeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3'
        ])

        const data = await ffmeg.readFile('output.mp3')
        const audioFileBlob = new Blob([data], {type: 'audio/mpeg'})
        return new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg'
        })
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const prompt = promptInputRef.current?.value

        if (!videoFile) {
            return
        }

        setStatus('converting')

        const audioFile = await convertVideoToAudio(videoFile)
        const data = new FormData()
        data.append('file', audioFile)

        setStatus('uploading')

        const response = await api.post('/videos', data)
        const videoId = response.data.video.id

        setStatus('generating')

        await api.post(`/videos/${videoId}/transcription`, {
            prompt
        })

        setStatus('success')

        props.onVideoUploaded(videoId)
    }


    const previewURL = useMemo(() => {
        if (!videoFile) {
            return null
        }

        return URL.createObjectURL(videoFile)

    }, [videoFile])

    return (
        <form className="space-y-6" onSubmit={handleUploadVideo}>
            <label
                htmlFor="video"
                className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
                {previewURL ?
                    <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0"/> : (
                        <>
                            <FileVideo className="w4 h-4"/>
                            Select a video
                        </>
                    )}
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>

            <div className="space-y-2">
                <Label htmlFor="transcription_prompt">Transcription prompt</Label>
                <Textarea
                    ref={promptInputRef}
                    id="transcription_prompt"
                    disabled={status !== 'waiting'}
                    className="h-20 leading-relaxed resize-none"
                    placeholder="Add some keywords mentioned in the video (comma separated)"
                />
            </div>

            <Button
                data-success={status === 'success'}
                disabled={status !== 'waiting'}
                className="w-full data-[success=true]:bg-emerald-400"
                type="submit"
            >
                {status === 'waiting' ? (
                    <>
                        Upload video
                        <Upload className="w-4 h-4 ml-2"/>
                    </>
                ) : statusMessages[status]}
            </Button>
        </form>
    )
}
