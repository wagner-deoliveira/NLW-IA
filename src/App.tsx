import {Button} from "@/components/ui/button.tsx";
import {FileVideo, Github, Upload, Wand2} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Slider} from "@/components/ui/slider.tsx";

export function App() {

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
                        />
                        <Textarea
                            placeholder="AI generated result" readOnly
                            className="resize-none p-4 leading-relaxed"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Remember: you can use the variable <code
                        className="text-yellow-500">{'{transcription}'}</code> in your prompt to add the content from
                        the transcription to the selected video
                    </p>
                </div>
                <aside className="w-80 space-y-6">
                    <form className="space-y-6">
                        <label
                            htmlFor="video"
                            className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
                        >
                            <FileVideo className="w4 h-4"/>
                            Select a video
                        </label>

                        <input type="file" id="video" accept="video/mp4" className="sr-only"/>

                        <div className="space-y-2">
                            <Label htmlFor="transcription_prompt">Transcription prompt</Label>
                            <Textarea
                                id="transcription_prompt"
                                className="h-20 leading-relaxed resize-none"
                                placeholder="Add some keywords mentioned in the video (comma separated)"
                            />
                        </div>

                        <Button className="w-full" type="submit">
                            Upload video
                            <Upload className="w-4 h-4 ml-2"/>
                        </Button>
                    </form>

                    <Separator/>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label>Prompt</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a prompt"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="title">YouTube Title</SelectItem>
                                    <SelectItem value="description">YouTube Description</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Slider min={0} max={1} step={0.1}/>
                            <span className="block text-xs text-muted-foreground italic leading-relaxed">
                                Higher values make the generated response more creative
                            </span>
                        </div>

                        <Separator/>
                        <Button className="w-full" type="submit">
                            Run
                            <Wand2 className="w-4 h-4 ml-2"/>
                        </Button>
                    </form>

                </aside>
            </main>
        </div>
    )
}

