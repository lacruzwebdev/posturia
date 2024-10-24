"use client"
import { useState } from "react"
import { getPostureo, publishInLinkedin } from "@/actions/server-actions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { readStreamableValue } from "ai/rsc"
import toast from "react-hot-toast"
import { schema } from "@/lib/formSchema"
import { Spinner } from "./ui/spinner"
import { LinkedInLogoIcon } from "@radix-ui/react-icons"

export default function PostureoForm({ session }: { session: Session }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generation, setGeneration] = useState("")

  return (
    <div>
      <div className="text-xl text-center mb-12">
        {generation ? (
          <p className="animate-in fade-in-0 slide-in-from-bottom-6 duration-1000">{generation}</p>
        ) : (
          <p className="opacity-10">Let PosturIA think for you...</p>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!generation) {
            const parsedInput = schema.parse({ prompt })
            setIsGenerating(true)
            setPrompt("")
            setGeneration("")
            const { output } = await getPostureo(parsedInput.prompt)

            for await (const delta of readStreamableValue(output)) {
              setGeneration((currentGeneration) => `${currentGeneration}${delta}`)
            }
            setIsGenerating(false)
          } else {
            const isPublished = await publishInLinkedin(generation, session).then(
              (res) => res.res === "ok"
            )
            if (isPublished) {
              setGeneration("")
              setPrompt("")
              toast.success("Post published in Linkedin!")
            }
          }
        }}
        className="gap-4 flex flex-col"
      >
        {!generation && (
          <Input
            type="text"
            name="prompt"
            placeholder="What do you want to humble brag about?"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            required
            disabled={isGenerating}
            maxLength={160}
            minLength={10}
          />
        )}
        {isGenerating ? (
          <Button type="button" disabled>
            <Spinner className="text-white" />
          </Button>
        ) : generation ? (
          <>
            <Button type="button" onClick={() => setGeneration("")}>
              WTF is this!? Regenerate!
            </Button>
            <Button type="submit" disabled={isGenerating} className="bg-[#0b66c2]">
              <LinkedInLogoIcon />
              <p>Publish in Linkedin</p>
            </Button>
          </>
        ) : (
          <Button type="submit" disabled={isGenerating}>
            Generate
          </Button>
        )}
      </form>
    </div>
  )
}
