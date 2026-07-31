import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <>
      <header className="h-[4rem] bg-[#070707] text-xl py-5 px-10 border-b border-neutral-900">
        RAG Project Explorer
      </header>
      <main className="max-w-4xl w-full mx-auto">
        <ChatInterface />
      </main>
      <footer className="h-[2rem]"></footer>
    </>
  );
}
