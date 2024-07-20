"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { ChatForm } from "./chatform"
import { ChatHeader } from "./chatheader"
import { useRouter } from "next/navigation"
import { ChatMessages } from "./chat-messages"
import { ChatMessageProps } from "./chat-message"
import { FormEvent } from "react"
import { Companion, Message } from "@prisma/client"

interface ChatClientProps {
  companion: Companion & {
    messages: Message[]
    _count: {
      messages: number
    }
  }
}

export const ChatClient: React.FC<ChatClientProps> = ({ companion }) => {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  )
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    }

    setMessages((current) => [...current, userMessage])
    setInput(" ")
    setIsLoading(true)

    try {
      const response = await axios.post(`/api/chat/${companion.id}`, {
        prompt: input,
      })

      const systemMessage: ChatMessageProps = {
        role: "system",
        content: response.data, // API returns the completion text
      }

      setMessages((current) => [...current, systemMessage])
      setInput(" ")
    } catch (error) {
      console.error("Error submitting message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
