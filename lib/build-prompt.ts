import { Tables } from "@/supabase/types"
import { ChatPayload, MessageImage } from "@/types"
import { encode } from "gpt-tokenizer"

const buildBasePrompt = (
  prompt: string,
  profileContext: string,
  workspaceInstructions: string,
  assistant: Tables<"assistants"> | null
) => {
  let fullPrompt =
    "All your output must be in Brazilian Portuguese, it is imperative, unless the user requests another language or his request is in another language."

  if (assistant) {
    fullPrompt += `<INJECT ROLE>\nYou are not an AI.  You are ${assistant.name}.\n</INJECT ROLE>\n\n`
  }

  fullPrompt += `Today is ${new Date().toLocaleDateString()}.\n\n`

  if (profileContext) {
    fullPrompt += `User Info:\n${profileContext}\n\n`
  }

  if (workspaceInstructions) {
    fullPrompt += `System Instructions:\n${workspaceInstructions}\n\n`
  }

  fullPrompt += `User Instructions:\n${prompt}`

  return fullPrompt
}

export async function buildFinalMessages(
  payload: ChatPayload,
  profile: Tables<"profiles">,
  chatImages: MessageImage[]
) {
  const {
    chatSettings,
    workspaceInstructions,
    chatMessages,
    assistant,
    messageFileItems,
    chatFileItems
  } = payload

  const BUILT_PROMPT = buildBasePrompt(
    chatSettings.prompt,
    chatSettings.includeProfileContext ? profile.profile_context || "" : "",
    chatSettings.includeWorkspaceInstructions ? workspaceInstructions : "",
    assistant
  )

  const CHUNK_SIZE = chatSettings.contextLength
  const PROMPT_TOKENS = encode(chatSettings.prompt).length

  let remainingTokens = CHUNK_SIZE - PROMPT_TOKENS

  let usedTokens = 0
  usedTokens += PROMPT_TOKENS

  const processedChatMessages = chatMessages.map((chatMessage, index) => {
    const nextChatMessage = chatMessages[index + 1]

    if (nextChatMessage === undefined) {
      return chatMessage
    }

    const nextChatMessageFileItems = nextChatMessage.fileItems

    if (nextChatMessageFileItems.length > 0) {
      const findFileItems = nextChatMessageFileItems
        .map(fileItemId =>
          chatFileItems.find(chatFileItem => chatFileItem.id === fileItemId)
        )
        .filter(item => item !== undefined) as Tables<"file_items">[]

      const retrievalText = buildRetrievalText(findFileItems)

      return {
        message: {
          ...chatMessage.message,
          content:
            `${chatMessage.message.content}\n\n${retrievalText}` as string
        },
        fileItems: []
      }
    }

    return chatMessage
  })

  let finalMessages = []

  for (let i = processedChatMessages.length - 1; i >= 0; i--) {
    const message = processedChatMessages[i].message
    const messageTokens = encode(message.content).length

    if (messageTokens <= remainingTokens) {
      remainingTokens -= messageTokens
      usedTokens += messageTokens
      finalMessages.unshift(message)
    } else {
      break
    }
  }

  let tempSystemMessage: Tables<"messages"> = {
    chat_id: "",
    assistant_id: null,
    content: BUILT_PROMPT,
    created_at: "",
    id: processedChatMessages.length + "",
    image_paths: [],
    model: payload.chatSettings.model,
    role: "system",
    sequence_number: processedChatMessages.length,
    updated_at: "",
    user_id: ""
  }

  finalMessages.unshift(tempSystemMessage)

  finalMessages = finalMessages.map(message => {
    let content

    if (message.image_paths.length > 0) {
      content = [
        {
          type: "text",
          text: message.content
        },
        ...message.image_paths.map(path => {
          let formedUrl = ""

          if (path.startsWith("data")) {
            formedUrl = path
          } else {
            const chatImage = chatImages.find(image => image.path === path)

            if (chatImage) {
              formedUrl = chatImage.base64
            }
          }
          if (chatSettings.model.indexOf("gpt-4o") !== -1) {
            return {
              type: "image_url",
              image_url: {
                url: formedUrl
              }
            }
          }
          return {
            type: "image_url",
            image_url: formedUrl
          }
        })
      ]
    } else {
      content = message.content
    }

    return {
      role: message.role,
      content
    }
  })

  if (messageFileItems.length > 0) {
    const retrievalText = buildRetrievalText(messageFileItems)

    finalMessages[finalMessages.length - 1] = {
      ...finalMessages[finalMessages.length - 1],
      content: `${
        finalMessages[finalMessages.length - 1].content
      }\n\n${retrievalText}`
    }
  }
  // finalMessages = await reorderRoles(finalMessages)
  return finalMessages
}

function buildRetrievalText(fileItems: Tables<"file_items">[]) {
  const retrievalText = fileItems
    .map(item => `<BEGIN SOURCE>\n${item.content}\n</END SOURCE>`)
    .join("\n\n")

  return `You can use the following sources if necessary to answer the user's question. Especially when he refers to it as a document, file, pdf, txt, book or related. If you don't know the answer, say "I don't know."\n\n${retrievalText}`
}

export async function buildGoogleGeminiFinalMessages(
  payload: ChatPayload,
  profile: Tables<"profiles">,
  messageImageFiles: MessageImage[]
) {
  const {
    chatSettings,
    workspaceInstructions,
    chatMessages,
    assistant,
    messageFileItems
  } = payload

  const BUILT_PROMPT = buildBasePrompt(
    chatSettings.prompt,
    chatSettings.includeProfileContext ? profile.profile_context || "" : "",
    chatSettings.includeWorkspaceInstructions ? workspaceInstructions : "",
    assistant
  )

  let finalMessages = []

  let usedTokens = 0
  const CHUNK_SIZE = chatSettings.contextLength
  const PROMPT_TOKENS = encode(chatSettings.prompt).length
  let REMAINING_TOKENS = CHUNK_SIZE - PROMPT_TOKENS

  usedTokens += PROMPT_TOKENS

  for (let i = chatMessages.length - 1; i >= 0; i--) {
    const message = chatMessages[i].message
    const messageTokens = encode(message.content).length

    if (messageTokens <= REMAINING_TOKENS) {
      REMAINING_TOKENS -= messageTokens
      usedTokens += messageTokens
      finalMessages.unshift(message)
    } else {
      break
    }
  }

  let tempSystemMessage: Tables<"messages"> = {
    chat_id: "",
    assistant_id: null,
    content: BUILT_PROMPT,
    created_at: "",
    id: chatMessages.length + "",
    image_paths: [],
    model: payload.chatSettings.model,
    role: "system",
    sequence_number: chatMessages.length,
    updated_at: "",
    user_id: ""
  }

  finalMessages.unshift(tempSystemMessage)

  let GOOGLE_FORMATTED_MESSAGES: any[] = []

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise(resolve => {
      const reader = new FileReader()

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1])
        }
      }

      reader.readAsDataURL(file)
    })

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type
      }
    }
  }

  if (
    chatSettings.model === "gemini-pro" ||
    chatSettings.model === "gemini-1.5-pro-latest"
  ) {
    GOOGLE_FORMATTED_MESSAGES = [
      {
        role: "user",
        parts: [
          {
            text: finalMessages[0].content
          }
        ]
      },
      {
        role: "model",
        parts: [
          {
            text: "I will follow your instructions."
          }
        ]
      }
    ]

    for (let i = 1; i < finalMessages.length; i++) {
      if (i === finalMessages.length - 1) {
        const retrievalText = buildRetrievalText(messageFileItems)

        finalMessages[finalMessages.length - 1] = {
          ...finalMessages[finalMessages.length - 1],
          content: `${
            finalMessages[finalMessages.length - 1].content
          }\n\n${retrievalText}`
        }
      }
      GOOGLE_FORMATTED_MESSAGES.push({
        role: finalMessages[i].role === "user" ? "user" : "model",
        parts: [
          {
            text: finalMessages[i].content as string
          }
        ]
      })
    }
    const files = messageImageFiles.map(file => file.file)

    const imageParts = await Promise.all(
      files.flatMap(file => (file ? [fileToGenerativePart(file)] : []))
    )

    GOOGLE_FORMATTED_MESSAGES[GOOGLE_FORMATTED_MESSAGES.length - 1].parts.push(
      ...imageParts
    )

    return GOOGLE_FORMATTED_MESSAGES
  } else if (chatSettings.model === "gemini-pro-vision") {
    // Gemini Pro Vision doesn't currently support messages
    let prompt = ""

    for (let i = 0; i < finalMessages.length; i++) {
      prompt += `${finalMessages[i].role}:\n${finalMessages[i].content}\n\n`
    }

    const files = messageImageFiles.map(file => file.file)
    const imageParts = await Promise.all(
      files.map(file =>
        file ? fileToGenerativePart(file) : Promise.resolve(null)
      )
    )

    // FIX: Hacky until chat messages are supported
    return [
      {
        prompt,
        imageParts
      }
    ]
  }
  return finalMessages
}
export async function buildClaudeFinalMessages(
  payload: ChatPayload,
  profile: Tables<"profiles">,
  chatImages: MessageImage[]
) {
  const finalMessages = await buildFinalMessages(payload, profile, chatImages)

  // Remove first assistant message
  if (
    finalMessages.length > 1 &&
    finalMessages[1].role !== "user" &&
    finalMessages[0].role === "system"
  ) {
    finalMessages[1].content = `${finalMessages[0].content}\n ${finalMessages[1].content}`
    return finalMessages.toSpliced(1, 1)
  }

  return finalMessages
}

async function reorderRoles(conversation: any) {
  const systemMessage = conversation.find(
    (message: any) => message.role === "system"
  )
  const userMessages = conversation.filter(
    (message: any) => message.role === "user"
  )
  const assistantMessages = conversation.filter(
    (message: any) => message.role === "assistant"
  )

  const reorderedConversation = []

  if (systemMessage) {
    reorderedConversation.push(systemMessage)
  }

  for (
    let i = 0;
    i < Math.max(userMessages.length, assistantMessages.length);
    i++
  ) {
    if (assistantMessages[i]) {
      reorderedConversation.push(assistantMessages[i])
    }
    if (userMessages[i]) {
      reorderedConversation.push(userMessages[i])
    }
  }

  return reorderedConversation
}
