"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTED_RESPONSES = [
  "I can draft smoke, sanity, and regression suites from your modules and acceptance criteria.",
  "I can structure test cases with preconditions, steps, expected results, and priority labels.",
  "I can help you split scenarios by feature area and prepare a release-ready test cart.",
  "I can generate both positive and negative test scenarios for checkout, cart, and payment flows.",
];

function useTypingText(fullText: string, speedMs = 18) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let index = 0;
    setTyped("");
    const timer = setInterval(() => {
      index += 1;
      setTyped(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(timer);
      }
    }, speedMs);

    return () => clearInterval(timer);
  }, [fullText, speedMs]);

  return typed;
}

export function DemoAssistant() {
  const starterPrompt = "I need to prepare smoke tests for checkout, payments, and cart.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "user", text: starterPrompt },
    {
      id: 2,
      role: "assistant",
      text: SUGGESTED_RESPONSES[0],
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const assistantMessage = useMemo(
    () => messages.filter((m) => m.role === "assistant").at(-1),
    [messages]
  );
  const typedAssistantText = useTypingText(assistantMessage?.text ?? "", 16);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const nextId = messages[messages.length - 1]?.id ?? 0;
    setMessages((prev) => [...prev, { id: nextId + 1, role: "user", text: trimmed }]);
    setDraft("");
    setIsTyping(true);

    const responseText =
      SUGGESTED_RESPONSES[Math.floor(Math.random() * SUGGESTED_RESPONSES.length)];

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId + 2, role: "assistant", text: responseText },
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-emerald-200/60 bg-white/90 shadow-[0_16px_50px_rgba(17,94,64,0.14)] dark:border-emerald-900/80 dark:bg-[#0f2118]/95 dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between bg-linear-to-r from-emerald-600 to-teal-500 px-5 py-4 text-white dark:from-emerald-700 dark:to-teal-700">
        <div>
          <p className="text-lg font-bold">TestCase Assistant</p>
          <p className="text-sm text-emerald-100">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-200" />
            Live and typing
          </p>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          Live Demo
        </span>
      </div>

      <div className="space-y-4 bg-[#f3faf5] px-4 py-5 sm:px-6 dark:bg-[#10261b]">
        {isTyping ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500" />
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-emerald-900/80 dark:bg-[#163425] dark:text-emerald-100/80">
              <span className="mr-1 inline-flex items-center gap-1 align-middle">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 [animation-delay:140ms]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 [animation-delay:260ms]" />
              </span>
              TestCase Assistant is preparing an answer...
            </div>
          </div>
        ) : null}

        {messages.slice(-3).map((message) => {
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className="ml-auto max-w-[88%] rounded-2xl bg-sky-500 px-4 py-3 text-sm font-medium text-white shadow-sm sm:max-w-xl"
              >
                {message.text}
              </div>
            );
          }

          const isLatestAssistant = message.id === assistantMessage?.id;
          return (
            <div
              key={message.id}
              className="max-w-[92%] rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm sm:max-w-2xl dark:border-emerald-900/80 dark:bg-[#163425] dark:text-emerald-50"
            >
              {isLatestAssistant ? typedAssistantText : message.text}
              {isLatestAssistant && typedAssistantText.length < message.text.length ? (
                <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-emerald-500 align-middle dark:bg-emerald-300" />
              ) : null}
            </div>
          );
        })}

        <form
          onSubmit={onSubmit}
          className="flex flex-col items-stretch gap-3 rounded-2xl border border-emerald-100 bg-white p-3 sm:flex-row sm:items-center dark:border-emerald-900/80 dark:bg-[#163425]"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask TestCase Assistant to draft scenarios..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-emerald-50 dark:placeholder:text-emerald-200/60"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-emerald-800 disabled:opacity-60 sm:w-auto"
            disabled={isTyping}
          >
            {isTyping ? "Typing..." : "Try Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
