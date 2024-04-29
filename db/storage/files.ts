import { supabase } from "@/lib/supabase/browser-client"
import { toast } from "sonner"

export const uploadFile = async (
  file: File,
  payload: {
    name: string
    user_id: string
    file_id: string
  }
) => {
  const SIZE_LIMIT = parseInt(
    process.env.NEXT_PUBLIC_USER_FILE_SIZE_LIMIT || "10000000"
  )

  if (file.size > SIZE_LIMIT) {
    throw new Error(
      `Arquivo precisa ser menor que ${Math.floor(SIZE_LIMIT / 1000000)}MB`
    )
  }

  const filePath = `${payload.user_id}/${Buffer.from(payload.file_id).toString("base64")}`

  const { error } = await supabase.storage
    .from("files")
    .upload(filePath, file, {
      upsert: true
    })

  if (error) {
    throw new Error("Erro ao subir arquivo")
  }

  return filePath
}

export const deleteFileFromStorage = async (filePath: string) => {
  const { error } = await supabase.storage.from("files").remove([filePath])

  if (error) {
    toast.error("Falha ao remover arquivo!")
    return
  }
}

export const getFileFromStorage = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from("files")
    .createSignedUrl(filePath, 60 * 60 * 24) // 24hrs

  if (error) {
    console.error(`Erro ao subir arquivo no caminho: ${filePath}`, error)
    throw new Error("Erro ao baixar arquivo.")
  }

  return data.signedUrl
}
