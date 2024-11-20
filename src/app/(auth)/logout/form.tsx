"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CardFormLoading } from "../components/CardForm";

export function Form() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/logout`, { method: "POST" });

      const result = await response.json();

      if (result.verified) {
        router.replace("/");
      } else {
        alert("Error");
        router.push("/");
      }
    })();
  }, []);

  return <CardFormLoading />;
}
