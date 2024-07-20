"use client"

import { useEffect, useState } from "react"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (src: string) => void
  disabled?: boolean
}

export const ImageUpload = ({
  value,
  onChange,
  disabled,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [newValue, setValue] = useState(value)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  // Above is so that we do not cause any hydration error

  const onUpload = (new_value_url: string) => {
    setValue(new_value_url)
    console.log("This is value", new_value_url)
  }

  return (
    <div className=" flex flex-col">
      <CldUploadButton
        onSuccess={(result: any) => {
          onChange(result.info.secure_url)
          onUpload(result.info.secure_url)
        }}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="nsn8o0li"
      >
        <div
          className="
        p-4
        px-8
        border-4
        border-dashed
        border-primary/10
        rounded-lg
        hover:opacity-75
        transition
        flex
        flex-col
        space-y-2
        items-center
        justify-center
        "
        >
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="Upload"
              sizes="w-max-400px"
              src={newValue || "/placeholder.png"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  )
}
