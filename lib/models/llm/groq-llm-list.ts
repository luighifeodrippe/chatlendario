import { LLM } from "@/types"

const GROQ_PLATORM_LINK = "https://groq.com/"

const LLaMA2_70B: LLM = {
  modelId: "llama2-70b-4096",
  modelName: "LLaMA2-70b-chat",
  provider: "groq",
  hostedId: "llama2-70b-4096",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA3_8b: LLM = {
  modelId: "llama3-8b-8192",
  modelName: "LLaMA3-8b-chat",
  provider: "groq",
  hostedId: "llama3-8b-8192",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA3_70b: LLM = {
  modelId: "llama3-70b-8192",
  modelName: "LLaMA3-70b-chat",
  provider: "groq",
  hostedId: "llama3-70b-8192",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const MIXTRAL_8X7B: LLM = {
  modelId: "mixtral-8x7b-32768",
  modelName: "Mixtral-8x7b-Instruct-v0.1",
  provider: "groq",
  hostedId: "mixtral-8x7b-32768",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

export const GROQ_LLM_LIST: LLM[] = [LLaMA3_8b, LLaMA3_70b, MIXTRAL_8X7B]
