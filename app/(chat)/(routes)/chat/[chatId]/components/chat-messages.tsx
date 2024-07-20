"use client"
import { Companion, Message } from "@prisma/client"
import { ChatMessage } from "./chat-message"
import { useRef, ElementRef, useEffect, useState } from "react"
interface ChatMessagesProps {
  companion: Companion
  isLoading: boolean
  messages: any[]
}
export const ChatMessages = ({
  companion,
  isLoading,
  messages = [],
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null)
  const [fakeLoading, setFakeLoading] = useState(
    messages.length == 0 ? true : false
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  })

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}. ${companion.description} are my key area of expertise`}
      />
      {messages.map((message) => (
        <ChatMessage
          key={`${message.id}-${message.role}-${message.content}`}
          role={message.role}
          content={message.content}
          src={companion.src}
        />
      ))}
      {
        //This one is fake message when loading is happening
        isLoading && <ChatMessage role="system" src={companion.src} isLoading />
      }

      <div ref={scrollRef} />
    </div>
  )
}
