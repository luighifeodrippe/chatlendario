import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AtualizarSenha({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const handleAtualizarSenha = async (formData: FormData) => {
    "use server"
    const novaSenha = formData.get("novaSenha") as string
    const confirmarSenha = formData.get("confirmarSenha") as string

    if (novaSenha !== confirmarSenha) {
      return redirect(`/reset-password?message=As senhas não correspondem`)
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
      error
    } = await supabase.auth.updateUser({ password: novaSenha })

    if (error) {
      return redirect(`/reset-password?message=${error.message}`)
    }

    return redirect("/login?message=Senha atualizada com sucesso")
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-6 rounded-lg p-8 shadow-md"
        action={handleAtualizarSenha}
      >
        <Brand />
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#CEB881]">
          Definir uma senha
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-md mb-4" htmlFor="novaSenha">
              Senha
            </Label>
            <Input
              className="w-full rounded-md border border-gray-300 bg-inherit px-4 py-2 focus:border-[#CEB881] focus:outline-none"
              type="password"
              name="novaSenha"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <Label className="text-md mb-4" htmlFor="confirmarSenha">
              Confirmar senha
            </Label>
            <Input
              className="w-full rounded-md border border-gray-300 bg-inherit px-4 py-2 focus:border-[#CEB881] focus:outline-none"
              type="password"
              name="confirmarSenha"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <SubmitButton className="mt-6 rounded-md bg-[#CEB881] px-4 py-2 text-white transition duration-200 hover:bg-[#B9A06E]">
          Confirmar
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 rounded bg-red-100 p-4 text-center text-red-700">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
