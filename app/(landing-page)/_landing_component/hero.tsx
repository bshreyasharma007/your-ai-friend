import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between items-center max-w-screen-xl pb-12 pt-0 md:p-20">
      <div className="p-10 pt-20 md:pt-0">
        <h1 className=" text-center md:text-left text-4xl md:text-6xl lg:text-8xl bg-gradient-to-r from-yellow-600 to-blue-500 text-transparent bg-clip-text font-serif ">
          Your AI Friend
        </h1>
        <div className="p-10 md:pl-2 lg:pl-5 pt-10">
          <p className="max-w-xl text-justify text-white">
            {" "}
            Get a chance to make a celebrity or famious person your friend and
            chat with them using AI model which is trained on your celebrity
            characteristics
          </p>
          <div className="pt-10 flex gap-x-10">
            <SignInButton>
              <Button
                variant={"secondary"}
                className="border-solid border-white border-2 p-5 pr-6 pl-6 hover:bg-primary/10"
              >
                Try for Free!
              </Button>
            </SignInButton>
            <Button
              size="sm"
              variant={"premium"}
              className="border-dotted border-gray-700 border-2 p-5 pr-8 pl-8 hover:bg-primary/10"
            >
              Upgrade{" "}
              <Sparkles className="h-4 2-4 fill-white text-white pl-1 " />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10 md:mt-0 pr-8 pt-8  bg-gradient-to-l from-yellow-200 to-yellow-500  rounded-full max-w-md flex-initial">
        <Image
          alt="Avatar Image"
          src="/avatar-ad.png"
          width={400}
          height={300}
          className="object-cover"
        ></Image>
      </div>
    </div>
  )
}

export default Hero
