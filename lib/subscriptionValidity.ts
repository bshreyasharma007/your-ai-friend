/*

Work in progress


import { auth } from "@clerk/nextjs/server"
import prismadb from "@/lib/prismadb"

const DAY_IN_MS = 84_400_000

export const checkSubscriptionValid = async () => {
  const { userId } = auth()

  //If user does not exist then subscription is not valid
  if (!userId) {
    return false
  }

  const userSubscription = await prismadb.userSubscription.findUnqie({
    where: {
      userId: userId,
    },
    select: {
      razorpayCurrentPeriodEnd: true,
      razorpayCustomerId: true,
      razorpayPriceId: true,
      razorpaySubscriptionId: true,
    },
  })
  

  //if userSubscription comes out to be null, that means that user never subscribed

  if (!userSubscription) {
    return false
  }

  //Is subscription exist, then we need to check if the validity is still there or not

  const isValid =
    userSubscription.razorpayPriceId &&
    userSubscription.razorpayCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now()

  return !!isValid
}
*/
