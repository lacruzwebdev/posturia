import { auth, signIn } from "@/auth"
import { Button } from "./ui/button"
import { LinkedInLogoIcon } from "@radix-ui/react-icons"

export default async function NavbarLogin() {
  const session = await auth()
  return (
    <div>
      {!session && (
        <form
          action={async () => {
            "use server"
            await signIn("linkedin")
          }}
        >
          <Button type="submit" className="bg-[#0b66c2]">
            <LinkedInLogoIcon />
            Login
          </Button>
        </form>
      )}
    </div>
  )
}
