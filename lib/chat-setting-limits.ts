import { LLMID } from "@/types"

type ChatSettingLimits = {
  MIN_TEMPERATURE: number
  MAX_TEMPERATURE: number
  MAX_TOKEN_OUTPUT_LENGTH: number
  MAX_CONTEXT_LENGTH: number
}

export const CHAT_SETTING_LIMITS: Record<LLMID, ChatSettingLimits> = {
  // ANTHROPIC MODELS
  "claude-2.1": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 200000
  },
  "claude-instant-1.2": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 100000
  },
  "claude-3-haiku-20240307": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 200000
  },
  "claude-3-sonnet-20240229": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 200000
  },
  "claude-3-opus-20240229": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 200000
  },

  // GOOGLE MODELS
  "gemini-pro": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 2048,
    MAX_CONTEXT_LENGTH: 30720
  },
  "gemini-pro-vision": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 12288
  },

  // MISTRAL MODELS
  "mistral-tiny": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 2000,
    MAX_CONTEXT_LENGTH: 8000
  },
  "mistral-small": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 2000,
    MAX_CONTEXT_LENGTH: 32000
  },
  "mistral-medium": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 2000,
    MAX_CONTEXT_LENGTH: 32000
  },
  "mistral-large-2402": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 2000,
    MAX_CONTEXT_LENGTH: 32000
  },

  // GROQ MODELS
  "llama2-70b-4096": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 4096
  },
  "llama3-8b-8192": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 8192,
    MAX_CONTEXT_LENGTH: 8192
  },
  "llama3-70b-8192": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 8192,
    MAX_CONTEXT_LENGTH: 8192
  },
  "mixtral-8x7b-32768": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 32768
  },

  // OPENAI MODELS
  "gpt-3.5-turbo": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 2.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 4096
    // MAX_CONTEXT_LENGTH: 16385 (TODO: Change this back to 16385 when OpenAI bumps the model)
  },
  "gpt-4-turbo-preview": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 2.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 128000
  },
  "gpt-4-vision-preview": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 2.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 128000
  },
  "gpt-4": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 2.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 8192
  },

  // PERPLEXITY MODELS
  "pplx-7b-online": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.99,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 4096
  },
  "pplx-70b-online": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.99,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 4096
  },
  "pplx-7b-chat": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 8192
  },
  "pplx-70b-chat": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 4096
  },
  "mixtral-8x7b-instruct": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 16384,
    MAX_CONTEXT_LENGTH: 16384
  },
  "mistral-7b-instruct": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 16384,
    MAX_CONTEXT_LENGTH: 16384
  },
  "llama-2-70b-chat": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 2.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 4096
  },
  "codellama-34b-instruct": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 4096,
    MAX_CONTEXT_LENGTH: 16384
  },
  "codellama-70b-instruct": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 16384,
    MAX_CONTEXT_LENGTH: 16384
  },
  "sonar-small-chat": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 16384,
    MAX_CONTEXT_LENGTH: 16384
  },
  "sonar-small-online": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 12000,
    MAX_CONTEXT_LENGTH: 12000
  },
  "sonar-medium-chat": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 16384,
    MAX_CONTEXT_LENGTH: 16384
  },
  "sonar-medium-online": {
    MIN_TEMPERATURE: 0.0,
    MAX_TEMPERATURE: 1.0,
    MAX_TOKEN_OUTPUT_LENGTH: 12000,
    MAX_CONTEXT_LENGTH: 12000
  }
}
