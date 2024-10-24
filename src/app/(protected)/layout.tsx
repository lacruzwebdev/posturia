import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Toaster } from "react-hot-toast"

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <main className="w-container mx-auto py-20">
      {children}
      <Toaster />
    </main>
  )
}
