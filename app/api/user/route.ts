import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { newEmail } = json as {
    newEmail: string
  }
  const { role } = json as {
    role: string
  }
  const { newPass } = json as {
    newPass: string
  }
  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const user_data = {
      email: newEmail,
      password: newPass, // Senha padrão; idealmente deveria ser única e segura para cada usuário
      email_confirm: true,
      app_metadata: { role: role }
    }
    const {
      data: { user },
      error
    } = await supabaseAdmin.auth.admin.createUser(user_data)

    if (!user) {
      throw new Error(error?.message)
    }

    return new Response(JSON.stringify({ user: user }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error?.message || "Ocorreu um erro inesperado."
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
