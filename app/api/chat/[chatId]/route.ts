import dotenv from "dotenv"
import { StreamingTextResponse } from "ai"
import { currentUser } from "@clerk/nextjs/server"
import { Replicate } from "@langchain/community/llms/replicate"
import { NextResponse } from "next/server"

import { MemoryManager } from "@/lib/memory"
import { rateLimit } from "@/lib/rate-limit"
import prismadb from "@/lib/prismadb"

dotenv.config({ path: `.env` })

export const maxDuration = 60 // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return new Response("Vercel", {
    status: 200,
  })
}

//
export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json()
    const user = await currentUser()

    console.log("This is the prompt", prompt)

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const identifier = request.url + "-" + user.id
    const { success } = await rateLimit(identifier)

    if (!success) {
      //Add Toast if rate limit exceeded
      return new NextResponse("Rate limit exceeded", { status: 429 })
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    })

    if (!companion) {
      return new NextResponse("Friend AI not found", { status: 404 })
    }

    const name = companion.id
    const companion_file_name = name + ".txt"

    const friendKey = {
      friendName: name!,
      userId: user.id,
      modelName: "llama2-13b",
    }
    const memoryManager = await MemoryManager.getInstance()

    const records = await memoryManager.readLatestHistory(friendKey)
    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", friendKey)
    }
    await memoryManager.writeToHistory("User: " + prompt + "\n", friendKey)

    // Query Pinecone

    const recentChatHistory = await memoryManager.readLatestHistory(friendKey)

    // Right now the preamble is included in the similarity search

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      companion_file_name
    )

    let relevantHistory = ""
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n")
    }

    // Call Replicate to initiate model
    const model = new Replicate({
      model:
        "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
    })

    // Turn verbose on for debugging
    model.verbose = true

    const resp = String(
      await model
        .invoke(
          `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

        ${companion.instructions}

        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${companion.name}:`
        )
        .catch(console.error)
    )

    const cleaned = resp.replaceAll(",", "")

    const response = cleaned.trim()
    await memoryManager.writeToHistory("" + response.trim(), friendKey)
    var Readable = require("stream").Readable

    let s = new Readable()
    s.push(response)
    s.push(null)
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), friendKey)

      await prismadb.companion.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      })
    }

    return new NextResponse(response.trim())
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

//Replicate
// https://js.langchain.com/v0.2/docs/integrations/llms/replicate/

//Langchain
//https://js.langchain.com/v0.2/docs/how_to/installation/#installing-integration-packages
