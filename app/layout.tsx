import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import ClientOnly from "@/components/ClientOnly"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Your AI Friend",
  description:
    "Get a chance to make a celebrity or famious person your friend and chat with them",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {" "}
            <body className={cn("bg-secondary", inter.className)}>
              {children}
              <Toaster />
            </body>
          </ThemeProvider>
        </ClientOnly>
      </html>
    </ClerkProvider>
  )
}
