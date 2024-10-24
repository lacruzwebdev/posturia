"use server"

import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { LanguageModelV1, streamText } from "ai"
import { createStreamableValue } from "ai/rsc"

export async function getPostureo(userPrompt: string) {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  })

  const stream = createStreamableValue("")

  ;(async () => {
    const { textStream } = await streamText({
      model: openrouter("openai/gpt-4o-2024-08-06") as LanguageModelV1,
      prompt: `Escribe una publicación de Linkedin de no más de 100 palabras pensada para convertirse en viral basándote en la siguiente descripción: ${userPrompt}`,
    })

    for await (const delta of textStream) {
      stream.update(delta)
    }

    stream.done()
  })()

  return { output: stream.value }
}

export async function publishInLinkedin(content: string, session: Session) {
  try {
    const res = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Connection: "keep-alive",
        Authorization: `Bearer ${session?.accessToken}`,
        "Linkedin-Version": "202406",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${session?.id}`,
        commentary: content,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    })

    if (!res.ok) throw new Error(`HTTP Error ${res.status}`)
    return { res: "ok" }
  } catch (e) {
    console.error("Error al publicar en Linkedin:", e)
    throw e
  }
}
