"use client"

import { CreateUser } from "@/components/utility/create-user"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateUserPage() {
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return null
  }

  return <CreateUser />
}
