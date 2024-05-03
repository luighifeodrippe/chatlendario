"use client"
// import { supabase } from "@/lib/supabase/admin-client"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Database } from "@/supabase/types"
import { Dropdown } from "react-day-picker"
import { Label } from "@radix-ui/react-dropdown-menu"

interface CreateUserProps {}

export const CreateUser: FC<CreateUserProps> = () => {
  const router = useRouter()

  const [newEmail, setNewEmail] = useState("")
  const [role, setRole] = useState("comunidade")
  const [newPass, setNewPass] = useState("")

  const handleCreateUser = async () => {
    if (!newEmail) return alert("Insira um email.")
    if (newPass.length < 7) return alert("Informe uma senha maior.")
    let body = {
      newEmail,
      role,
      newPass
    }
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(body)
    })
    console.log(response)
    if (response.ok) {
      alert("Usuário incluído com sucesso!")
    } else {
      alert("Erro na inclusão do usuário, email já registrado.")
    }

    // return router.push("/create-user")
  }

  return (
    <Dialog open={true}>
      <DialogContent className="h-[240px] w-[400px] p-4">
        <DialogHeader>
          <DialogTitle>Criar usuário com role</DialogTitle>
        </DialogHeader>

        <Input
          id="email"
          placeholder="Email do Aluno"
          type="email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
        />
        <Input
          id="senha"
          placeholder="Senha para o Aluno"
          type="text"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
        />

        {/* <Input
          id="role"
          placeholder="Formação ou Comunidade"
          type="hidden"
          value={role}
          onChange={e => setRole(e.target.value)}
        /> */}
        <Label>Tipo de Usuário</Label>
        <div>
          <select value={role} onChange={e => setRole(e.target.value)}>
            {/* <option value="">Selecione uma opção</option> */}
            <option value="formacao">Formação</option>
            <option value="comunidade">Comunidade</option>
          </select>
          {/* <p>Opção selecionada: {role}</p> */}
        </div>
        <Button onClick={handleCreateUser}>Criar Usuário</Button>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
