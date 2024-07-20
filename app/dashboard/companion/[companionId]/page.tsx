import { auth } from "@clerk/nextjs/server"
import prismadb from "@/lib/prismadb"
import { CompanionForm } from "./_components/companion-form"

interface CompanionIdPageProps {
  params: {
    companionId: string
  }
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth()

  if (!userId) {
    return auth().redirectToSignIn()
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  })

  const categories = await prismadb.category.findMany()

  return <CompanionForm initialData={companion} categories={categories} />
}

export default CompanionIdPage
