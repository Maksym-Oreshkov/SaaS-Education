"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionResultPage() {
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [names, setNames] = useState<{
    companionName: string;
    userName: string;
  }>({ companionName: "Assistant", userName: "User" });
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("transcript");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        // Backward compatibility: old format was just an array of messages
        setMessages(parsed);
      } else if (parsed && Array.isArray(parsed.messages)) {
        setMessages(parsed.messages);
        setNames({
          companionName: parsed.companionName || "Assistant",
          userName: parsed.userName || "User",
        });
      }
    } catch (e) {
      console.error("Failed to parse transcript from sessionStorage", e);
    }
  }, []);

  const handleRepeat = () => {
    router.push("/");
  };

  return (
    <section className="h-screen flex flex-col p-2">
      <div className="transcript flex flex-col flex-1 max-h-[80%]">
        <h1 className="text-2xl font-bold mb-4">Session Transcript</h1>
        <div className="space-y-2  overflow-y-auto pr-2">
          {messages.map((m, i) => (
            <p
              key={i}
              className={
                m.role === "assistant" ? "text-gray-800" : "text-primary"
              }
            >
              <strong>
                {m.role === "assistant" ? names.companionName : names.userName}:
              </strong>{" "}
              {m.content}
            </p>
          ))}
        </div>
        <button
          onClick={handleRepeat}
          className="mt-6 px-4 py-2 bg-primary text-white rounded-lg shrink-0"
        >
          To Home
        </button>
      </div>
    </section>
  );
}
