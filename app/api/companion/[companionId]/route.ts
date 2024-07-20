import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json()
    const user = await currentUser()
    const { src, name, description, instructions, seed, categoryId } = body

    console.log("Companion ID", params.companionId)
    console.log("Params", params)
    if (!params.companionId) {
      return new NextResponse("Companion ID is required", { status: 400 })
    }
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    console.log("COmpanion params", params)
    console.log("Companion id", params.companionId)

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,

        userId: user.id,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    })
    return NextResponse.json(companion)
  } catch (error) {
    console.log("[COMPANION_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    console.log("---------------Entering DELETE------------------")
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 })
    }
    console.log("COmpanion params, params")
    console.log("Companion id", params.companionId)
    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    })
    console.log("-------------Deleted the companion-----------")
    return NextResponse.json(companion)
  } catch (error) {
    console.log("[COMPANION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
