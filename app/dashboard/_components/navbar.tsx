import { Menu, Sparkles } from "lucide-react"
import Link from "next/link"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileSideBar } from "./mobile-sidebar"
const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
})
export const NavBar = () => {
  return (
    <div className="h-16 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSideBar />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-2xl font-bold text-primary",
              font.className
            )}
          >
            Your AI Friend
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <Button size="sm" variant={"premium"}>
          Upgrade <Sparkles className="h-4 2-4 fill-white text-white pl-1" />
        </Button>
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}
