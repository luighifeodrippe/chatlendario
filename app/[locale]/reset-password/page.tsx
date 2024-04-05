"use client"

import { useEffect, useState } from "react"
import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function ResetPassword({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100) // Delay to trigger animation
    return () => clearTimeout(timer)
  }, [])

  const handleResetPassword = async (formData: FormData) => {
    // Redefinição de senha lógica
  }

  return (
    <div
      className={`flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md ${isVisible ? "opacity-100 transition-opacity duration-700" : "opacity-0"}`}
    >
      <form
        className="flex w-full flex-1 flex-col justify-center gap-2"
        action={handleResetPassword}
      >
        <Brand />
        <div className="text-center">
          <h1 className="mb-4 text-lg font-semibold">Defina uma senha</h1>
        </div>
        <Label className="text-md mt-2" htmlFor="newPassword">
          Senha
        </Label>
        <Input
          className="mb-2 rounded-md border bg-inherit px-4 py-2 transition duration-300 ease-in-out focus:outline-none focus:ring-0"
          style={{
            borderColor: "#a8976a"
          }}
          type="password"
          name="newPassword"
          placeholder="••••••••"
          required
        />

        <Label className="text-md mt-1" htmlFor="confirmPassword">
          Confirmar Senha
        </Label>
        <Input
          className="mb-2 rounded-md border bg-inherit px-4 py-2 transition duration-300 ease-in-out focus:outline-none focus:ring-0"
          style={{
            borderColor: "#a8976a"
          }}
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          required
        />

        <SubmitButton
          className="mb-2 rounded-md px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-opacity-80"
          style={{
            backgroundColor: "#a8976a"
          }}
        >
          Confirmar
        </SubmitButton>
      </form>
    </div>
  )
}
