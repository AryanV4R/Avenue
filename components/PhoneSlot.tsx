"use client";

import { useEffect } from "react";
import { H, W, useFit } from "@/components/PhonePreview";

/** Khali jagah jahan root wala phone aake baithta hai. */
export default function PhoneSlot() {
  const s = useFit();

  useEffect(() => {
    window.dispatchEvent(new Event("phone-slot"));
    return () => {
      window.dispatchEvent(new Event("phone-slot"));
    };
  }, [s]);

  return <div id="phone-slot" className="mx-auto" style={{ width: W * s, height: H * s }} />;
}