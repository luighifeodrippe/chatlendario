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
  const handleResetPassword = async (formData: FormData) => {
    "use server"

    const newPassword = formData.get("newPassword") as string
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

    return redirect("/login?message=Redefinição de senha bem-sucedida")
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={handleResetPassword}
      >
        <Brand />

        <Label className="text-md mt-4" htmlFor="newPassword">
          Nova Senha
        </Label>
        <Input
          className="mb-3 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="newPassword"
          placeholder="••••••••"
          required
        />

        <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
          Redefinir senha
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
