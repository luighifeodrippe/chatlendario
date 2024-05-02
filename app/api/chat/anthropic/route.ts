import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import {
  checkApiKey,
  getServerProfile,
  limitMessage
} from "@/lib/server/server-chat-helpers"
import { getBase64FromDataURL, getMediaTypeFromDataURL } from "@/lib/utils"
import { ChatSettings } from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import { AnthropicStream, StreamingTextResponse } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { ANTHROPIC_LLM_LIST } from "@/lib/models/llm/anthropic-llm-list"
export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.anthropic_api_key, "Anthropic")
    if (
      ANTHROPIC_LLM_LIST.find(model => model.modelId === chatSettings.model)
        ?.highTier
    )
      await limitMessage()

    let ANTHROPIC_FORMATTED_MESSAGES: any = messages.slice(1)

    ANTHROPIC_FORMATTED_MESSAGES = ANTHROPIC_FORMATTED_MESSAGES?.map(
      (message: any) => {
        const messageContent =
          typeof message?.content === "string"
            ? [message.content]
            : message?.content

        return {
          ...message,
          content: messageContent.map((content: any) => {
            if (typeof content === "string") {
              // Handle the case where content is a string
              return { type: "text", text: content }
            } else if (
              content?.type === "image_url" &&
              content?.image_url?.length
            ) {
              return {
                type: "image",
                source: {
                  type: "base64",
                  media_type: getMediaTypeFromDataURL(content.image_url),
                  data: getBase64FromDataURL(content.image_url)
                }
              }
            } else {
              return content
            }
          })
        }
      }
    )

    const anthropic = new Anthropic({
      apiKey: profile.anthropic_api_key || ""
    })

    try {
      const response = await anthropic.messages.create({
        model: chatSettings.model,
        messages: ANTHROPIC_FORMATTED_MESSAGES,
        temperature: chatSettings.temperature,
        system: messages[0].content,
        max_tokens:
          CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
        stream: true
      })

      try {
        const stream = AnthropicStream(response)
        return new StreamingTextResponse(stream)
      } catch (error: any) {
        console.error("Erro ao analisar a resposta da Anthropic API:", error)
        return new NextResponse(
          JSON.stringify({
            message: "Ocorreu um erro ao analisar a resposta da Anthropic API:"
          }),
          { status: 500 }
        )
      }
    } catch (error: any) {
      console.error("Erro ao chamar a Anthropic API:", error)
      return new NextResponse(
        JSON.stringify({
          message: "Ocorreu um erro ao chamar a Anthropic API."
        }),
        { status: 500 }
      )
    }
  } catch (error: any) {
    let errorMessage = error.message || "Ocorreu um erro inesperado.."
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("chave de api ausente")) {
      errorMessage =
        "Chave de API ausente paraAnthropic API. Por favor configure-a em seu perfil."
    } else if (errorCode === 401) {
      errorMessage =
        "A chave da Anthropic API está incorreta. Por favor ajuste nas configurações do seu perfil."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
