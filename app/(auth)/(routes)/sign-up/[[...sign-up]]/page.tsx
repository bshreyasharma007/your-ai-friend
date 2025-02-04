import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="h-full flex justify-center items-center">
      <SignUp path="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  )
}
