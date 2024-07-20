import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface BotAvatarInterface {
  src: string
}

export const BotAvatar: React.FC<BotAvatarInterface> = ({ src }) => {
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={src} />
    </Avatar>
  )
}
