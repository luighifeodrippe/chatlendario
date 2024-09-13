import { OPENAI_LLM_LIST } from "@/lib/models/llm/openai-llm-list"
import {
  checkApiKey,
  getServerProfile,
  limitMessage
} from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }
  try {
    const profile = await getServerProfile()
    if (
      OPENAI_LLM_LIST.find(model => model.modelId === chatSettings.model)
        ?.highTier
    )
      await limitMessage()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const isO1Model = ["o1-preview", "o1-mini"].includes(chatSettings.model)

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      ...(["gpt-4-vision-preview", "gpt-4-turbo", "gpt-4o"].includes(
        chatSettings.model
      )
        ? { max_tokens: 4096 }
        : isO1Model
          ? { max_completion_tokens: 4096 }
          : {}),
      stream: !isO1Model
    })

    if (isO1Model) {
      if ("choices" in response) {
        const content = response.choices[0].message.content || ""
        console.log("O1 Model Response:", content)
        return new Response(content, {
          status: 200,
          headers: {
            "Content-Type": "text/plain"
          }
        })
      } else {
        throw new Error("Unexpected response format for O1 model")
      }
    } else {
      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    }
  } catch (error: any) {
    let errorMessage = error.message || "Ocorreu um erro inesperado."
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
