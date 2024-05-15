import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."
import jschardet from "jschardet"
import { Buffer } from "buffer"

export const processTxt = async (txt: Blob): Promise<FileItemChunk[]> => {
  const arrayBuffer = await txt.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  // Converter Uint8Array para Buffer
  const buffer = Buffer.from(uint8Array)

  // Detectar a codificação do arquivo
  const detected = jschardet.detect(buffer)
  const encoding = detected.encoding

  // console.log(`Detected encoding: ${encoding}`);

  // Decodificar o conteúdo do arquivo usando a codificação detectada
  const textDecoder = new TextDecoder(encoding)
  const textContent = textDecoder.decode(uint8Array)

  // Re-encodar o conteúdo em UTF-8
  const utf8Encoder = new TextEncoder()
  const utf8ArrayBuffer = utf8Encoder.encode(textContent)

  // Converter o ArrayBuffer para uma string UTF-8
  const utf8Text = new TextDecoder("utf-8").decode(utf8ArrayBuffer)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([utf8Text])

  let chunks: FileItemChunk[] = []

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}
