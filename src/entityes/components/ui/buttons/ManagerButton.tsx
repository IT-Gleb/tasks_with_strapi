"use client";

import { Button } from "@heroui/react";
import { User2 } from "lucide-react";
import { useRouter } from "next/navigation";

const toManager: string = "/dashboard";

const ManagerButton = () => {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      variant="outline"
      size="sm"
      onPress={() => router.push(toManager)}
      className={"w-8 h-8 scale-85 p-3 active:scale-70"}
    >
      <User2 size={20} />
    </Button>
  );
};

export default ManagerButton;
