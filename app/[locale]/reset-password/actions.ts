"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function handleResetPassword(formData: FormData) {
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (newPassword !== confirmPassword) {
    return redirect("/reset-password?message=As senhas não coincidem.")
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
    error
  } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return redirect(`/reset-password?message=${error.message}`)
  }

  return redirect("/login?message=A atualização da senha foi bem-sucedida.")
}
