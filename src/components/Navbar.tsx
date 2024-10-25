import { auth, signOut } from "@/auth"
import NavbarLogin from "./NavbarLogin"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"

export default async function Navbar() {
  const session = await auth()
  const userInitials = session?.user?.name
    ? session.user?.name?.split(" ")[0][0] + session.user?.name?.split(" ")[1][0]
    : "UI"
  return (
    <header className="flex w-container py-4 mx-auto justify-between items-center absolute left-0 right-0">
      <p className="font-bold text-lg">PosturIA</p>
      <div className="flex items-center gap-4">
        {session && (
          <div className="flex gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={session.picture} alt="Avatar" />
                  <AvatarFallback>{userInitials.toUpperCase()}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <p className="font-bold">{session.user?.name}</p>
                <p className="mb-4">{session.user?.email}</p>
                <form
                  className="flex justify-center"
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <Button type="submit">Signout</Button>
                </form>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <NavbarLogin />
      </div>
    </header>
  )
}
