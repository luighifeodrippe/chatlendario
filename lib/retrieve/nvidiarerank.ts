import fetch from "node-fetch"
interface Chunk {
  content: string
  // outras propriedades se houver
}
export async function rerankChunks(
  userInput: string,
  chunks: Chunk[],
  sourceCount: number
): Promise<any[]> {
  const invokeUrl = process.env.NVIDIA_API_URL!
  const headers = {
    Authorization: `Bearer ${process.env.NVIDIA_API_KEY!}`,
    Accept: "application/json"
  }

  const payload = {
    model: process.env.NVIDIA_API_MODEL!,
    query: {
      text: userInput
    },
    passages: chunks.map(({ content }) => ({ text: content }))
  }

  const response = await fetch(invokeUrl, {
    method: "post",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", ...headers }
  })

  const responseBody = await response.json()

  let rerankedChunks: Chunk[] = chunks

  if (responseBody.rankings) {
    rerankedChunks = chunks
      .sort((a, b) => {
        const indexA = responseBody.rankings.findIndex(
          (rank: { index: number }) => rank.index === chunks.indexOf(a)
        )
        const indexB = responseBody.rankings.findIndex(
          (rank: { index: number }) => rank.index === chunks.indexOf(b)
        )
        return indexA - indexB
      })
      .slice(0, sourceCount)

    // console.log(JSON.stringify(responseBody));
  }

  return rerankedChunks
}
