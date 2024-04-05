import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export default function MagicLinkLogin({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const signInWithMagicLink = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const origin = headers().get("origin")
    const emailRedirectTo = `${origin}/auth/callback?next=/`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo
      }
    })

    if (error) {
      return redirect(`/login/magic-link?message=${error.message}`)
    }

    return redirect(
      "/login/magic-link?message=Verifique seu e-mail para obter o Magic Link"
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={signInWithMagicLink}
      >
        <Brand />

        <Label className="text-md mt-4" htmlFor="email">
          E-mail
        </Label>
        <Input
          className="mb-3 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="voce@exemplo.com"
          required
        />

        <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
          Conecte-se com o Magic Link
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
