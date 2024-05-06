import { Database, Tables, TablesUpdate } from "@/supabase/types"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { createServerClient } from "@supabase/ssr"
import { LLMID } from "@/types"
import { cookies } from "next/headers"
import { updateProfile } from "@/db/profile"

export async function getServerProfile() {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    throw new Error("Perfil não encontrado")
  }

  const profileWithKeys = addApiKeysToProfile(profile)

  return profileWithKeys
}

function addApiKeysToProfile(profile: Tables<"profiles">) {
  const apiKeys = {
    [VALID_ENV_KEYS.OPENAI_API_KEY]: "openai_api_key",
    [VALID_ENV_KEYS.ANTHROPIC_API_KEY]: "anthropic_api_key",
    [VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY]: "google_gemini_api_key",
    [VALID_ENV_KEYS.MISTRAL_API_KEY]: "mistral_api_key",
    [VALID_ENV_KEYS.GROQ_API_KEY]: "groq_api_key",
    [VALID_ENV_KEYS.PERPLEXITY_API_KEY]: "perplexity_api_key",
    [VALID_ENV_KEYS.AZURE_OPENAI_API_KEY]: "azure_openai_api_key",
    [VALID_ENV_KEYS.OPENROUTER_API_KEY]: "openrouter_api_key",

    [VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID]: "openai_organization_id",

    [VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT]: "azure_openai_endpoint",
    [VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME]: "azure_openai_35_turbo_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME]: "azure_openai_45vision_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME]: "azure_openai_45_turbo_id",
    [VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME]: "azure_openai_embeddings_id"
  }

  for (const [envKey, profileKey] of Object.entries(apiKeys)) {
    if (process.env[envKey]) {
      ;(profile as any)[profileKey] = process.env[envKey]
    }
  }

  return profile
}

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === "") {
    throw new Error(`Chave API ${keyName} não encontrada.`)
  }
}
const MESSAGE_LIMIT = 20
const TIMEOUT_HOURS = 3
const MODELS = ["claude-3-opus-20240229", "gpt-4-turbo-preview"]

async function getMessageCount(profile: Tables<"profiles">): Promise<number> {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        }
      }
    }
  )

  const threeHoursAgo = getThreeHoursAgoDate()
  console.log("threeHoursAgo")
  console.log(threeHoursAgo)
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .in("model", MODELS)
    .eq("role", "user")
    .gte("created_at", threeHoursAgo.toISOString())
  return count || 0
}

export async function limitMessage() {
  const profile = await getServerProfile()
  const currentDate = new Date()
  // currentDate.setHours(currentDate.getHours() - 3)
  const lastTimeOut = profile.last_timeout
    ? profile.last_timeout
    : getThreeHoursAgoDate().toISOString()
  console.log("currentDate")
  console.log(currentDate)
  console.log("lastTimeOut")
  console.log(lastTimeOut)
  if (lastTimeOut < currentDate.toISOString()) {
    try {
      const messageCount = await getMessageCount(profile)
      console.log("messageCount")
      console.log(messageCount)
      if (messageCount >= MESSAGE_LIMIT) {
        const timeoutDate = new Date(
          currentDate.getTime() + TIMEOUT_HOURS * 60 * 60 * 1000
        )
        await updateProfileTimeout(profile.id, timeoutDate)
        throw new Error(
          "Você ultrapassou o limite de mensagens nas últimas 3 horas, tire um tempo para você."
        )
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  } else {
    const offsetHours = -3 // Seu fuso horário (-3 horas)

    // Converter a data ISO para um objeto Date
    const date = new Date(lastTimeOut)

    // Obter a diferença em milissegundos entre o fuso horário local e o UTC
    const offset = date.getTimezoneOffset() + offsetHours * 60

    // Criar um novo objeto Date com a diferença de fuso horário aplicada
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000)

    // Extrair as horas e minutos da data ajustada
    const hours = adjustedDate.getHours().toString().padStart(2, "0")
    let minutes = adjustedDate.getMinutes().toString().padStart(2, "0")
    minutes = (parseInt(minutes) + 1).toString().padStart(2, "0")
    const adjustedTimeString = `${hours}:${minutes}`
    throw new Error(
      `Você ultrapassou o limite de mensagens nas últimas 3 horas para este modelo. Seu acesso ao Opus e GPT-Turbo será em ${adjustedTimeString}. Utilize outro modelo enquanto isso.`
    )
  }
}

function getThreeHoursAgoDate(): Date {
  const currentDate = new Date()
  currentDate.setHours(currentDate.getHours() - 3)
  return currentDate
}

async function updateProfileTimeout(
  profileId: string,
  timeoutDate: Date
): Promise<void> {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        }
      }
    }
  )

  const { error } = await supabase
    .from("profiles")
    .update({ last_timeout: timeoutDate.toISOString() })
    .eq("id", profileId)
    .select()

  if (error) {
    console.error("Erro ao atualizar last_timeout:", error)
    throw error
  }
}
