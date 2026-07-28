"use client";

import { setAuthCookie } from "@/app/lib/actions";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { SERVER_LOCAL_API } from "@/shared/utils/consts";
import { Button } from "@heroui/react";
import { User2 } from "lucide-react";
import { useRouter } from "next/navigation";

const toManager: string = "/dashboard";

const ManagerButton = () => {
  const router = useRouter();

  const handlerUserWithCookie = async () => {
    const query = getCacheQueryClient();
    const url = SERVER_LOCAL_API + "/checkuser";
    //console.log(url);

    const isToken = await query.fetchQuery({
      queryKey: ["manager", 1],
      queryFn: async () => {
        const res = await fetch(url, {
          headers: { "content-type": "application/json; charset=utf-8" },
          method: "POST",
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({}),
          credentials: "include",
        });

        const result = await res.json();
        return result;
        //console.log(user);
      },
      staleTime: 10000,
    });
    // console.log(isOk);
    if (isToken.ok) {
      //cookiesList.getAll().map((i) => console.log(i.name, i.value));
      setAuthCookie(isToken.token);
    }
  };

  return (
    <Button
      isIconOnly
      variant="outline"
      size="sm"
      onPress={() => {
        handlerUserWithCookie();
        router.push(toManager);
        router.refresh();
      }}
      className={"w-8 h-8 scale-85 p-3 active:scale-70"}
    >
      <User2 size={20} />
    </Button>
  );
};

export default ManagerButton;
