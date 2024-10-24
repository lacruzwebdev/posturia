import AuthForm from "@/components/AuthForm"

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-container flex flex-col gap-8 row-start-2 items-center sm:items-start text-center">
        <h1 className="text-6xl font-bold mx-auto">PosturIA</h1>
        <p className="text-lg">
          Since most posts are more about looking good than being real, you might as well let an AI
          do the writing for you. PosturIA crafts the perfect LinkedIn updates, because who needs
          authenticity when you can have perfectly polished posts without lifting a finger?
        </p>
        <AuthForm />
      </main>
    </div>
  )
}
