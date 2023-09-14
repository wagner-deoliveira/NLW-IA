import {Button} from "@/components/ui/button.tsx";
import {Github, Wand2} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {VideoInputForm} from "@/components/video-input-form.tsx";
import {PromptSelect} from "@/components/prompt-select.tsx";
import {useState} from "react";
import {useCompletion} from "ai/react";

export function App() {
    const [temperature, setTemperature] = useState(0.5)
    const [videoId, setVideoId] = useState<string | null>()
    const {input, setInput, handleInputChange, handleSubmit, completion, isLoading} = useCompletion({
        api: 'http://localhopst:42069/ai/completion',
        body: {
            videoId,
            temperature
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return (
        <div className="min-h-screen flex flex-col">
            <div className="px-6 py-3 items-center justify-between border-b">
                <h1 className="text-xl font-bold">upload.ai</h1>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">With love from Think-R</span>
                    <Separator orientation="vertical" className="h-6"/>
                    <Button variant="outline">
                        <Github className="w-4 h-4 mr-2"/>
                        GitHub
                    </Button>
                </div>
            </div>

            <main className="flex-1 p-6 flex gap-6">
                <div className="flex flex-col flex-1 gap-4">
                    <div className="grid grid-rows-2 gap-4 flex-1">
                        <Textarea
                            placeholder="AI prompt"
                            className="resize-none p-4 leading-relaxed"
                            value={input}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            readOnly
                            className="resize-none p-4 leading-relaxed"
                            placeholder="AI generated result"
                            value={completion}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Remember: you can use the variable <code
                        className="text-yellow-500">{'{transcription}'}</code> in your prompt to add the content from
                        the transcription to the selected video
                    </p>
                </div>
                <aside className="w-80 space-y-6">
                    <VideoInputForm onVideoUploaded={setVideoId}/>
                    <Separator/>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Prompt</Label>
                            <PromptSelect onPromptSelected={setInput}/>
                        </div>

                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Select defaultValue="gpt3.5" disabled>
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="block text-xs text-muted-foreground italic">You will be able to customize it soon</span>
                        </div>

                        <Separator/>

                        <div className="space-y-4">
                            <Label>Temperature</Label>
                            <Slider
                                min={0}
                                max={1}
                                step={0.1}
                                value={[temperature]}
                                onValueChange={value => setTemperature(value[0])}
                            />
                            <span className="block text-xs text-muted-foreground italic leading-relaxed">
                                Higher values make the generated response more creative
                            </span>
                        </div>

                        <Separator/>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            Run
                            <Wand2 className="w-4 h-4 ml-2"/>
                        </Button>
                    </form>

                </aside>
            </main>
        </div>
    )
}

