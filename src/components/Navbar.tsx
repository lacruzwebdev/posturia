import { auth } from "@/auth"
import NavbarLogin from "./NavbarLogin"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default async function Navbar() {
  const session = await auth()
  console.log(session)

  return (
    <header className="flex w-container py-4 mx-auto justify-between items-center absolute left-0 right-0">
      <p className="font-bold text-lg">PosturIA</p>
      <div className="flex items-center gap-4">
        {session && (
          <div className="flex gap-2 items-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src={session.picture} alt="Avatar" />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <p className="text-xs">{session.user?.name}</p>
          </div>
        )}
        <NavbarLogin />
      </div>
    </header>
  )
}
