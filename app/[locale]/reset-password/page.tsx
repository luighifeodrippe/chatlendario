import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function ResetPassword({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = document.querySelector<HTMLInputElement>(
      'input[name="newPassword"]'
    )?.value
    const confirmPassword = document.querySelector<HTMLInputElement>(
      'input[name="confirmPassword"]'
    )?.value
    setPasswordsMatch(newPassword === confirmPassword)
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"

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

    return redirect("/login?message=A senha foi cadastrada com sucesso.")
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={handleResetPassword}
      >
        <Brand />

        <Label className="text-md mt-2" htmlFor="newPassword">
          Senha
        </Label>
        <div className="relative">
          <Input
            className="mb-1 rounded-md border bg-inherit px-4 py-2 pr-10"
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="••••••••"
            required
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <Label className="text-md mt-2" htmlFor="confirmPassword">
          Confirmar senha
        </Label>
        <div className="relative">
          <Input
            className="mb-1 rounded-md border bg-inherit px-4 py-2 pr-10"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="••••••••"
            required
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {passwordsMatch ? (
          <p className="mt-1 text-green-500">As senhas coincidem.</p>
        ) : (
          <p className="mt-1 text-red-500">As senhas não coincidem.</p>
        )}

        <SubmitButton className="mb-2 mt-4 rounded-md bg-blue-700 px-4 py-2 text-white">
          Confirmar
        </SubmitButton>

        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
