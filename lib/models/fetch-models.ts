import { Tables } from "@/supabase/types"
import { LLM, LLMID, OpenRouterLLM } from "@/types"
import { toast } from "sonner"
import { LLM_LIST_MAP } from "./llm/llm-list"

export const fetchHostedModels = async (profile: Tables<"profiles">) => {
  try {
    const providers = ["google", "anthropic", "mistral", "groq", "perplexity"]

    if (profile.use_azure_openai) {
      providers.push("azure")
    } else {
      providers.push("openai")
    }

    const response = await fetch("/api/keys")

    if (!response.ok) {
      throw new Error(`Servidor não está respondendo.`)
    }

    const data = await response.json()

    let modelsToAdd: LLM[] = []

    for (const provider of providers) {
      let providerKey: keyof typeof profile

      if (provider === "google") {
        providerKey = "google_gemini_api_key"
      } else if (provider === "azure") {
        providerKey = "azure_openai_api_key"
      } else {
        providerKey = `${provider}_api_key` as keyof typeof profile
      }

      if (profile?.[providerKey] || data.isUsingEnvKeyMap[provider]) {
        const models = LLM_LIST_MAP[provider]

        if (Array.isArray(models)) {
          modelsToAdd.push(...models)
        }
      }
    }

    return {
      envKeyMap: data.isUsingEnvKeyMap,
      hostedModels: modelsToAdd
    }
  } catch (error) {
    console.warn("Error fetching hosted models: " + error)
  }
}

export const fetchOllamaModels = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags"
    )

    if (!response.ok) {
      throw new Error(`Servidor Ollama não está respondendo.`)
    }

    const data = await response.json()

    const localModels: LLM[] = data.models.map((model: any) => ({
      modelId: model.name as LLMID,
      modelName: model.name,
      provider: "ollama",
      hostedId: model.name,
      platformLink: "https://ollama.ai/library",
      imageInput: false
    }))

    return localModels
  } catch (error) {
    console.warn("Error fetching Ollama models: " + error)
  }
}

export const fetchOpenRouterModels = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models")

    if (!response.ok) {
      throw new Error(`OpenRouter não está respondendo.`)
    }

    const { data } = await response.json()

    // const removedModels = process.env.REMOVED_OPEN_ROUTER_MODELS?.split(',') || [] //Adicionar variável de ambiente e remover linha abaixo
    const removedModels = "anthropic/claude-3-opus:beta,anthropic/claude-3-opus"

    const openRouterModelsFiltered = data.filter(
      (model: { id: string }) => !removedModels.includes(model.id)
    )

    const openRouterModels = openRouterModelsFiltered.map(
      (model: {
        id: string
        name: string
        context_length: number
      }): OpenRouterLLM => ({
        modelId: model.id as LLMID,
        modelName: model.id,
        provider: "openrouter",
        hostedId: model.name,
        platformLink: "https://openrouter.dev",
        imageInput: false,
        maxContext: model.context_length
      })
    )

    return openRouterModels
  } catch (error) {
    console.error(": Erro ao buscar modelos do Open Router" + error)
    toast.error("Erro ao buscar modelos do Open Router: " + error)
  }
}
