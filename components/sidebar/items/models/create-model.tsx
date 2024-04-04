import { SidebarCreateItem } from "@/components/sidebar/items/all/sidebar-create-item"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { MODEL_NAME_MAX } from "@/db/limits"
import { TablesInsert } from "@/supabase/types"
import { FC, useContext, useState } from "react"

interface CreateModelProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CreateModel: FC<CreateModelProps> = ({ isOpen, onOpenChange }) => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext)

  const [isTyping, setIsTyping] = useState(false)

  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [description, setDescription] = useState("")
  const [modelId, setModelId] = useState("")
  const [name, setName] = useState("")
  const [contextLength, setContextLength] = useState(4096)

  if (!profile || !selectedWorkspace) return null

  return (
    <SidebarCreateItem
      contentType="models"
      isOpen={isOpen}
      isTyping={isTyping}
      onOpenChange={onOpenChange}
      createState={
        {
          user_id: profile.user_id,
          api_key: apiKey,
          base_url: baseUrl,
          description,
          context_length: contextLength,
          model_id: modelId,
          name
        } as TablesInsert<"models">
      }
      renderInputs={() => (
        <>
          <div className="space-y-1.5 text-sm">
            <div>Create a custom model.</div>

            <div>
              Your API <span className="font-bold">*must*</span> be compatible
              with the OpenAI SDK.
            </div>
          </div>

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
            <Label>Base URL</Label>

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
            <Label>Comprimento Máximo do Contexto...</Label>

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
