import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="h-full flex justify-center items-center">
      <SignIn path="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  )
}
