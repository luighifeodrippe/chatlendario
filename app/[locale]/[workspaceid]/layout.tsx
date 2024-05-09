"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantWorkspacesByWorkspaceId } from "@/db/assistants"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getCollectionWorkspacesByWorkspaceId } from "@/db/collections"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"
import { getFoldersByWorkspaceId } from "@/db/folders"
import { getModelWorkspacesByWorkspaceId } from "@/db/models"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { getAssistantImageFromStorage } from "@/db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "@/db/tools"
import { getWorkspaceById } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { supabase } from "@/lib/supabase/browser-client"
import { LLMID } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"
// import { SpeedInsights } from "@vercel/speed-insights/next"
interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const workspaceId = params.workspaceid as string

  const {
    chatSettings,
    setChatSettings,
    setAssistants,
    setAssistantImages,
    setChats,
    setCollections,
    setFolders,
    setFiles,
    setPresets,
    setPrompts,
    setTools,
    setModels,
    selectedWorkspace,
    setSelectedWorkspace,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatFiles,
    setChatImages,
    setNewMessageFiles,
    setNewMessageImages,
    setShowFilesDisplay
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        // console.log(session.user)
        await fetchWorkspaceData(workspaceId)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => await fetchWorkspaceData(workspaceId))()

    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)

    setIsGenerating(false)
    setFirstTokenReceived(false)

    setChatFiles([])
    setChatImages([])
    setNewMessageFiles([])
    setNewMessageImages([])
    setShowFilesDisplay(false)
  }, [workspaceId])

  const fetchWorkspaceData = async (workspaceId: string) => {
    setLoading(true)

    // for (const assistant of assistantData.assistants) {
    //   let url = ""

    //   if (assistant.image_path) {
    //     url = (await getAssistantImageFromStorage(assistant.image_path)) || ""
    //   }

    //   if (url) {
    //     const response = await fetch(url)
    //     const blob = await response.blob()
    //     const base64 = await convertBlobToBase64(blob)

    //     setAssistantImages(prev => [
    //       ...prev,
    //       {
    //         assistantId: assistant.id,
    //         path: assistant.image_path,
    //         base64,
    //         url
    //       }
    //     ])
    //   } else {
    //     setAssistantImages(prev => [
    //       ...prev,
    //       {
    //         assistantId: assistant.id,
    //         path: assistant.image_path,
    //         base64: "",
    //         url
    //       }
    //     ])
    //   }
    // }

    const workspace = await getWorkspaceById(workspaceId)
    setSelectedWorkspace(workspace)

    const [
      workspaceData,
      assistantData,
      chats,
      collectionData,
      folders,
      fileData,
      presetData,
      promptData,
      modelData
    ] = await Promise.all([
      getWorkspaceById(workspaceId),
      getAssistantWorkspacesByWorkspaceId(workspaceId),
      getChatsByWorkspaceId(workspaceId),
      getCollectionWorkspacesByWorkspaceId(workspaceId),
      getFoldersByWorkspaceId(workspaceId),
      getFileWorkspacesByWorkspaceId(workspaceId),
      getPresetWorkspacesByWorkspaceId(workspaceId),
      getPromptWorkspacesByWorkspaceId(workspaceId),
      getModelWorkspacesByWorkspaceId(workspaceId)
    ])

    // const assistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId)
    setSelectedWorkspace(workspace)
    setAssistants(assistantData.assistants)
    // console.log(chats)
    setChats(chats)
    setCollections(collectionData.collections)
    setFolders(folders)
    setFiles(fileData.files)
    setPresets(presetData.presets)
    setPrompts(promptData.prompts)
    setModels(modelData.models)

    const parallelize = async (array: any, callback: any) => {
      const promises = array.map((item: any) => callback(item))
      return Promise.all(promises)
    }

    // await parallelize(
    //   [...assistantData.assistants],
    //   async (assistant: any) => {
    //     let url = assistant.image_path
    //       ? (await getAssistantImageFromStorage(assistant.image_path))
    //       : ""

    //     if (url) {
    //       // const response = await fetch(url)
    //       // const blob = await response.blob()
    //       // const base64 = await convertBlobToBase64(blob)

    //       setAssistantImages(prev => [
    //         ...prev,
    //         {
    //           assistantId: assistant.id,
    //           path: assistant.image_path,
    //           base64: "",
    //           url
    //         }
    //       ])
    //     } else {
    //       setAssistantImages(prev => [
    //         ...prev,
    //         {
    //           assistantId: assistant.id,
    //           path: assistant.image_path,
    //           base64: "",
    //           url
    //         }
    //       ])
    //     }
    //   }
    // )

    const session = (await supabase.auth.getSession()).data.session
    let defModel =
      session?.user?.app_metadata.role !== "formacao"
        ? "claude-3-haiku-20240307"
        : "gpt-4-1106-preview"
    // console.log(defModel)
    // console.log(workspace?.default_model)
    setChatSettings({
      model: (session?.user?.app_metadata.role !== "formacao"
        ? "claude-3-haiku-20240307"
        : workspace?.default_model || defModel) as LLMID,
      prompt:
        workspace?.default_prompt ||
        "Você é um assistente amigável, prestativo e responde as solicitações do usuário em Português do Brasil.",
      temperature: workspace?.default_temperature || 0,
      contextLength: workspace?.default_context_length || 128000,
      includeProfileContext: workspace?.include_profile_context || false,
      includeWorkspaceInstructions:
        workspace?.include_workspace_instructions || true,
      embeddingsProvider:
        (workspace?.embeddings_provider as "openai" | "local") || "openai"
    })
    setLoading(false)

    const assistantImages = await parallelize(
      assistantData.assistants,
      async (assistant: any) => {
        let url = ""
        if (assistant.image_path) {
          url = (await getAssistantImageFromStorage(assistant.image_path)) || ""
        }

        if (url) {
          const response = await fetch(url)
          const blob = await response.blob()
          const base64 = await convertBlobToBase64(blob)

          return {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64,
            url
          }
        } else {
          return {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64: "",
            url
          }
        }
      }
    )

    setAssistantImages(assistantImages)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      {/* <SpeedInsights /> */}
      <Dashboard>{children}</Dashboard>
    </>
  )
}
