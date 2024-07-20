import { Redis } from "@upstash/redis"
import { OpenAIEmbeddings } from "@langchain/openai"
import { Pinecone } from "@pinecone-database/pinecone"
import { PineconeStore } from "@langchain/pinecone"

export type FriendKey = {
  friendName: string
  modelName: string
  userId: string
}

export class MemoryManager {
  private static instance: MemoryManager
  private history: Redis
  private vectorDBClient: Pinecone

  public constructor() {
    this.history = Redis.fromEnv()
    this.vectorDBClient = new Pinecone()
  }

  public async init() {
    this.vectorDBClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    const pineconeClient = <Pinecone>this.vectorDBClient

    const pineconeIndex = pineconeClient.Index(
      process.env.PINECONE_INDEX! || ""
    )

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    )

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
      .catch((err) => {
        console.log("WARNING: failed to get vector search results.", err)
      })
    return similarDocs
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
      await MemoryManager.instance.init()
    }
    return MemoryManager.instance
  }

  private generateRedisFriendKey(friendKey: FriendKey): string {
    return `${friendKey.friendName}-${friendKey.modelName}-${friendKey.userId}`
  }

  public async writeToHistory(text: string, friendKey: FriendKey) {
    if (!friendKey || typeof friendKey.userId == "undefined") {
      console.log("Companion key set incorrectly")
      return ""
    }

    const key = this.generateRedisFriendKey(friendKey)
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    })

    return result
  }

  public async readLatestHistory(friendKey: FriendKey): Promise<string> {
    if (!friendKey || typeof friendKey.userId == "undefined") {
      console.log("Companion key set incorrectly")
      return ""
    }

    const key = this.generateRedisFriendKey(friendKey)
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    })

    result = result.slice(-30).reverse()
    const recentChats = result.reverse().join("\n")
    return recentChats
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    friendKey: FriendKey
  ) {
    const key = this.generateRedisFriendKey(friendKey)
    if (await this.history.exists(key)) {
      console.log("User already has chat history")
      return
    }

    const content = seedContent.split(delimiter)
    let counter = 0
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line })
      counter += 1
    }
  }
}
