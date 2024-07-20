import { UserButton } from "@clerk/nextjs"
import { SearchInput } from "./_components/search-input"
import prismadb from "@/lib/prismadb"
import { Categories } from "./_components/categories"
import { Companions } from "./_components/companions"

interface RootPageProps {
  searchParams: {
    categoryId: string
    name: string
  }
}
// Every server component in Next js has SearchParams parameter

const Dashboard = async ({ searchParams }: RootPageProps) => {
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: { search: searchParams.name },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  })

  const categories = await prismadb.category.findMany()

  return (
    <div className="h-full p-4 pl-6 space-y-2 md:pl-[115px]">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  )
}

export default Dashboard
