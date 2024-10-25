"use client"
import { FormEvent, useState } from "react"
import { getPostureo, publishInLinkedin } from "@/actions/server-actions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { readStreamableValue } from "ai/rsc"
import toast from "react-hot-toast"
import { schema } from "@/lib/formSchema"
import { Spinner } from "./ui/spinner"
import { LinkedInLogoIcon } from "@radix-ui/react-icons"
import { ZodError } from "zod"

export default function PostureoForm({ session }: { session: Session }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generation, setGeneration] = useState("")
  const [error, setError] = useState("")

  async function handleGeneration(prompt: string) {
    try {
      const parsedInput = schema.parse({ prompt })
      setIsGenerating(true)
      setPrompt("")
      setGeneration("")
      const { output } = await getPostureo(parsedInput.prompt)

      for await (const delta of readStreamableValue(output)) {
        setGeneration((currentGeneration) => `${currentGeneration}${delta}`)
      }
      setIsGenerating(false)
    } catch (e) {
      if (e instanceof ZodError) {
        setError(e.issues[0].message)
        console.error("Validation error:", e.issues[0].message)
      }
    }
  }

  async function handlePublish(generation: string, session: Session) {
    const isPublished = await publishInLinkedin(generation, session).then((res) => res.res === "ok")
    if (isPublished) {
      setGeneration("")
      setPrompt("")
      toast.success("Post published in Linkedin!")
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!generation) {
      await handleGeneration(prompt)
    } else {
      await handlePublish(generation, session)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    setPrompt(e.target.value)
  }

  return (
    <div>
      <div className="text-xl text-center mb-12">
        {generation ? (
          <p className="animate-in fade-in-0 slide-in-from-bottom-6 duration-1000">{generation}</p>
        ) : (
          <p className="opacity-10">Let PosturIA think for you...</p>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
        {!generation && (
          <Input
            type="text"
            name="prompt"
            placeholder="What do you want to humble brag about?"
            onChange={handleInputChange}
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
