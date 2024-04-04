import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MODEL_NAME_MAX } from "@/db/limits"
import { Tables, TablesUpdate } from "@/supabase/types"
import { IconSparkles } from "@tabler/icons-react"
import { FC, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"

interface ModelItemProps {
  model: Tables<"models">
}

export const ModelItem: FC<ModelItemProps> = ({ model }) => {
  const [isTyping, setIsTyping] = useState(false)

  const [apiKey, setApiKey] = useState(model.api_key)
  const [baseUrl, setBaseUrl] = useState(model.base_url)
  const [description, setDescription] = useState(model.description)
  const [modelId, setModelId] = useState(model.model_id)
  const [name, setName] = useState(model.name)
  const [contextLength, setContextLength] = useState(model.context_length)

  return (
    <SidebarItem
      item={model}
      isTyping={isTyping}
      contentType="models"
      icon={<IconSparkles height={30} width={30} />}
      updateState={
        {
          api_key: apiKey,
          base_url: baseUrl,
          description,
          context_length: contextLength,
          model_id: modelId,
          name
        } as TablesUpdate<"models">
      }
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <Label>Nome</Label>

            <Input
              placeholder="Nome do Modelo..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={MODEL_NAME_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>ID do Modelo</Label>

            <Input
              placeholder="ID do Modelo..."
              value={modelId}
              onChange={e => setModelId(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>URL Base</Label>

            <Input
              placeholder="URL Base..."
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
            />

            <div className="pt-1 text-xs italic">
              Sua API deve ser compatível com o OpenAI SDK.
            </div>
          </div>

          <div className="space-y-1">
            <Label>Chave API</Label>

            <Input
              type="password"
              placeholder="Chave API..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Tamanho Máximo do Contexto...</Label>

            <Input
              type="number"
              placeholder="4096"
              min={0}
              value={contextLength}
              onChange={e => setContextLength(parseInt(e.target.value))}
            />
          </div>
        </>
      )}
    />
  )
}
