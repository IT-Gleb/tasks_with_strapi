"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Error({ statusCode }: { statusCode: string }) {
  const router = useRouter();

  return (
    <div className="min-h-full p-4 w-fit mx-auto text-center">
      <p>
        {statusCode
          ? `Ошибка ${statusCode} возникла на сервере`
          : "Ошибка возникла на клиенте. Перезагрузите страницу. Если ошибка повторяется свяжитесь с нами."}
      </p>
      <div className="mt-5 w-fit mx-auto flex gap-x-3 item-center justify-evenly">
        <Button size="sm" variant="ghost" onPress={() => router.push("/")}>
          На главную
        </Button>
        <Button
          size="sm"
          variant="danger-soft"
          onPress={() => window.location.reload()}
        >
          Перезагрузить
        </Button>
      </div>
    </div>
  );
}
