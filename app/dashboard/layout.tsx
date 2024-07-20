"use client"
import { NavBar } from "./_components/navbar"
import { SideBar } from "./_components/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-full" suppressHydrationWarning>
      <NavBar />
      <div className=" hidden h-min-screen md:flex pt-16 w-30 flex-col fixed inset-y-0">
        <SideBar />
      </div>
      <main className="h-full">{children}</main>
    </div>
  )
}

export default DashboardLayout
