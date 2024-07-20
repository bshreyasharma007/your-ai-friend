"use client"

//Import Server side component in client side
import { useUser } from "@clerk/clerk-react"
import Navigation from "./_landing_component/navigation"
import Hero from "./_landing_component/hero"
import FooterPage from "./_landing_component/footer"
import TechStack from "./_landing_component/tech-stack"
import { useRouter } from "next/navigation"
const LandingPage = () => {
  const router = useRouter()
  const { isSignedIn } = useUser()
  if (isSignedIn) {
    //If user is already logged in then re-direct it towards dashboard
    return router.push("/dashboard")
  } else {
    //Show landing page
    return (
      <div className="relative bg-slate-900 min-h-screen h-full w-screen">
        <Navigation></Navigation>
        <div className="flex justify-center min-h-screen h-full">
          <Hero></Hero>
        </div>
        {/*Add a line*/}
        <div className="flex justify-center w-full pb-8">
          <div className="border-t-[2px] border-white w-2/3"> </div>
        </div>
        <div className="pb-10">
          <TechStack></TechStack>
        </div>
        <FooterPage></FooterPage>
      </div>
    )
  }
}

export default LandingPage
