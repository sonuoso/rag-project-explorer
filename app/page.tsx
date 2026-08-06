import ChatInterface from "@/components/ChatInterface";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="flex items-center gap-2 h-[4rem] bg-[#0e0e0e]/25 backdrop-blur-md py-5 px-10 border-b border-neutral-900">
        <Image src="/RepocerySVGLogo.svg" alt="Repocery" width={32} height={32} />
        <div className="font-inter text-xl">Repocery</div>
      </header>
      <main className="max-w-4xl w-full mx-auto">
        <ChatInterface />
      </main>
      <footer className="h-[2rem]"></footer>
    </>
  );
}
