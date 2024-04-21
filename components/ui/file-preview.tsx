import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { ChatFile, MessageImage } from "@/types"
import { IconFileFilled } from "@tabler/icons-react"
import Image from "next/image"
import { FC } from "react"
import { DrawingCanvas } from "../utility/drawing-canvas"
import { Dialog, DialogContent } from "./dialog"

interface FilePreviewProps {
  type: "image" | "file" | "file_item"
  item: ChatFile | MessageImage | Tables<"file_items">
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const FilePreview: FC<FilePreviewProps> = ({
  type,
  item,
  isOpen,
  onOpenChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex items-center justify-center outline-none",
          "border-transparent bg-transparent"
        )}
      >
        {(() => {
          if (type === "image") {
            const imageItem = item as MessageImage

            return imageItem.file ? (
              <DrawingCanvas imageItem={imageItem} />
            ) : (
              <Image
                className="rounded"
                src={imageItem.base64 || imageItem.url}
                alt="File image"
                width={2000}
                placeholder="blur"
                loading="lazy"
                blurDataURL="data:image/svg+xml;bsase64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScgLz4KICAgICAgPC9maWx0ZXI+CgogICAgICA8aW1hZ2UgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZScgZmlsdGVyPSd1cmwoI2IpJyB4PScwJyB5PScwJyBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyAKICAgICAgaHJlZj0nZGF0YTppbWFnZS9hdmlmO2Jhc2U2NCwvOWovMndCREFBZ0dCZ2NHQlFnSEJ3Y0pDUWdLREJRTkRBc0xEQmtTRXc4VUhSb2ZIaDBhSEJ3Z0pDNG5JQ0lzSXh3Y0tEY3BMREF4TkRRMEh5YzVQVGd5UEM0ek5ETC8yd0JEQVFrSkNRd0xEQmdORFJneUlSd2hNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpML3dBQVJDQUFMQUJBREFTSUFBaEVCQXhFQi84UUFGZ0FCQVFFQUFBQUFBQUFBQUFBQUFBQUFCZ01ILzhRQUloQUFBZ0lDQWdFRkFRQUFBQUFBQUFBQUFRSURCQVVSQUNFU0JoTVVNVUhCLzhRQUZRRUJBUUFBQUFBQUFBQUFBQUFBQUFBQUFBTC94QUFaRVFBREFBTUFBQUFBQUFBQUFBQUFBQUFBQVJFQ0lUSC8yZ0FNQXdFQUFoRURFUUEvQU5KdFhNbEZqekxjaGZIMVl4dDVQa3B2ZjUzL0FEWGZJeGVzemtFclJZK3V0eVYxVVNsU3dDc1U4aHM2ME5nRTY0aEVVZCtrOWEzR2swRWkrTG82Z2dnOWNNNTJOYU9GdFdxbzltWlN6cXlIV2pvOWdmWDd3M3VsNHpoLy85az0nIC8+CiAgICA8L3N2Zz4KICA="
                height={2000}
                style={{
                  maxHeight: "67vh",
                  maxWidth: "67vw"
                }}
              />
            )
          } else if (type === "file_item") {
            const fileItem = item as Tables<"file_items">
            return (
              <div className="bg-background text-primary h-[50vh] min-w-[700px] overflow-auto whitespace-pre-wrap rounded-xl p-4">
                <div>{fileItem.content}</div>
              </div>
            )
          } else if (type === "file") {
            return (
              <div className="rounded bg-blue-500 p-2">
                <IconFileFilled />
              </div>
            )
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}
