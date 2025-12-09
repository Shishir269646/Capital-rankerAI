"use client";

import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="">
      <main>

        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
        <Button onClick={() => alert("it works")}>Click Me</Button>

      </main>
    </div>
  );
}