import fetch from "node-fetch"
interface Chunk {
  content: string
}
export async function rerankChunks(
  userInput: string,
  chunks: Chunk[],
  sourceCount: number
): Promise<any[]> {
  const invokeUrl = process.env.COHERE_API_URL!
  const headers = {
    Authorization: `Bearer ${process.env.COHERE_API_KEY!}`,
    Accept: "application/json"
  }

  const payload = {
    model: process.env.COHERE_API_MODEL!,
    query: userInput,
    documents: chunks.map(({ content }) => content)
  }

  const response = await fetch(invokeUrl, {
    method: "post",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", ...headers }
  })

  const responseBody = await response.json()

  let rerankedChunks: Chunk[] = [...chunks]

  if (responseBody.results !== undefined) {
    rerankedChunks = chunks.sort((a, b) => {
      const indexA = responseBody.results.findIndex(
        (index: { index: number }) => index.index === chunks.indexOf(a)
      )
      const indexB = responseBody.results.findIndex(
        (index: { index: number }) => index.index === chunks.indexOf(b)
      )
      return indexA - indexB
    })
  }

  return rerankedChunks.slice(0, sourceCount)
}
