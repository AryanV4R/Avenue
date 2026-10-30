"use client";

import { useRef, useState } from "react";
import { sanitizeHandle, validateHandleFormat } from "@/lib/handle";
import { isHandleAvailable } from "@/lib/storage";
import { inputCls, primaryBtn } from "../ui";

export default function ChooseHandle({
  profileId,
  onSave,
}: {
  profileId: string;
  onSave: (handle: string) => void;
}) {
  const seq = useRef(0);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onHandle(raw: string) {
    const h = sanitizeHandle(raw);
    setDraft(h);
    const fmt = validateHandleFormat(h);
    if (fmt) return setMsg({ ok: false, text: fmt });
    const my = ++seq.current;
    const ok = await isHandleAvailable(h, profileId);
    if (my !== seq.current) return;
    setMsg(ok ? { ok: true, text: "Available" } : { ok: false, text: "Already taken" });
  }

  return (
    <div className="mx-auto grid min-h-dvh max-w-sm place-items-center px-5">
      <div className="w-full space-y-4">
        <h1 className="text-xl font-semibold">Choose your handle</h1>
        <input
          className={inputCls}
          placeholder="yourname"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={draft}
          onChange={(e) => onHandle(e.target.value)}
        />
        {msg && (
          <p className={msg.ok ? "text-sm text-emerald-500" : "text-sm text-red-500"}>{msg.text}</p>
        )}
        <button
          className={`${primaryBtn} w-full`}
          disabled={!msg?.ok}
          onClick={() => onSave(draft)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}