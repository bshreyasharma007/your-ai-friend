"use client"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Companion, Message } from "@prisma/client"
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BotAvatar } from "./bot-avatar"
import { useUser } from "@clerk/nextjs"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
interface ChatHeaderProps {
  companion: Companion & {
    messages: Message[]
    _count: {
      messages: number
    }
  }
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ companion }) => {
  const router = useRouter()
  const { user } = useUser()

  const { toast } = useToast()

  const onDelete = async () => {
    try {
      await axios.delete(`/api/companion/${companion.id}`)
      toast({ description: "Success" })

      router.refresh()
      router.push("/dashboard")
    } catch (error) {
      toast({ description: "Something went wrong", variant: "destructive" })
    }
  }
  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button size="icon" variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <BotAvatar src={companion.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{companion.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-3 h-3 mr-1" />
              {companion._count.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Created By {companion.userName}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center gap-x-4">
        <ModeToggle />
        {user?.id === companion.userId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  console.log("URL", `/dashboard/companion/${companion.id}`)
                  router.push(`/dashboard/companion/${companion.id}`)
                }}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
