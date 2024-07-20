import { auth } from "@clerk/nextjs/server"
import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation"
import { ChatClient } from "./components/chatclient"

interface ChatIdPageProps {
  params: {
    chatId: string
  }
}

const ChatIdPage: React.FC<ChatIdPageProps> = async ({ params }) => {
  const { userId } = auth()

  if (!userId) {
    return auth().redirectToSignIn()
  }

  console.log("Parameter", params.chatId)

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  })

  if (!companion) {
    return redirect("/dashboard")
  }

  return <ChatClient companion={companion} />
}

export default ChatIdPage
