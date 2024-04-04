import { FC } from "react"

interface FinishStepProps {
  displayName: string
}

export const FinishStep: FC<FinishStepProps> = ({ displayName }) => {
  return (
    <div className="space-y-4">
      <div>
        Bem-vindo ao Lab[IA]
        {displayName.length > 0 ? `, ${displayName.split(" ")[0]}` : null}!
      </div>

      <div>Clique em próximo para começar a conversar.</div>
    </div>
  )
}
