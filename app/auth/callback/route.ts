import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (next === "/reset-password") {
    return NextResponse.redirect(`${requestUrl.origin}/reset-password`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Verifica se o código é um Magic Link
    if (code.startsWith("magiclink")) {
      await supabase.auth.verifyOtp({
        type: "magiclink",
        email: "", // O email será extraído automaticamente do código do Magic Link
        token: code
      })
    } else {
      // Troca o código por uma sessão normalmente
      await supabase.auth.exchangeCodeForSession(code)
    }
  }

  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin)
  }
}
