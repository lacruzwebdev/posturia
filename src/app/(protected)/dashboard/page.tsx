import { auth } from "@/auth"
import PostureoForm from "@/components/PostureoForm"

export default async function Dashboard() {
  const session = (await auth()) as Session
  return <PostureoForm session={session} />
}
