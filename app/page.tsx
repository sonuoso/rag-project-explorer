import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (<>
  <header><h1 className="h-[4.5rem] bg-[#151515] text-xl px-10 py-5">RAG Project Explorer</h1></header>
  <main className="max-w-4xl w-full mx-auto">
      <ChatInterface />
    </main>
  </>
  )
}