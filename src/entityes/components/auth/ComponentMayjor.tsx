"use client";

import { handlerUserWithCookie } from "@/app/lib/actions";
import { gifImages, managerInitRequest } from "@/shared/utils/consts";
import { Wait } from "@/shared/utils/functions";
import { Button, cn } from "@heroui/react";
import { Loader, Server } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useMemo,
  useRef,
} from "react";

const gifBack = "/images/form_manager/back_with_mafon.gif";

type TImagesState = {
  step: number;
  imageSrc: string;
  //duration: number;
};

type TAction =
  | { type: "wait" }
  | { type: "hired" }
  | { type: "button" }
  | { type: "next" }
  | { type: "setStep"; payload: { step: number; imageSrc: string } };

const InitState: TImagesState = {
  step: 0,
  imageSrc: gifImages[0],
};

const ImageReducer = (state: TImagesState, action: TAction): TImagesState => {
  switch (action.type) {
    case "wait":
      return {
        ...state,
        step: 0,
        imageSrc: gifImages[0],
      };
    case "hired":
      return {
        ...state,
        step: 1,
        imageSrc: gifImages[1],
      };
    case "button":
      return {
        ...state,
        step: 2,
        imageSrc: gifImages[2],
      };
    case "next":
      let t_step = state.step + 1;
      if (t_step > gifImages.length - 1) {
        t_step = 0;
      }
      return {
        ...state,
        step: t_step,
        imageSrc: gifImages[t_step],
      };

    case "setStep": {
      let t_step = Math.abs(action.payload.step);
      t_step > gifImages.length - 1
        ? (t_step = 0)
        : t_step < 0
          ? (t_step = 0)
          : t_step;

      return {
        ...state,
        step: t_step,
        imageSrc: gifImages[t_step],
      };
    }
    default: {
      // Exhaustiveness check: Ensures all switch cases are handled
      const _exhaustiveCheck: never = action;
      return state;
    }
  }
};

const InitFormState = {
  status: "null",
};

async function checkManager(
  prevState: { status: string },
  ActionPayload: FormData,
) {
  // const rnd = Math.floor(Math.random() * 10);
  //console.log(ActionPayload);
  const email = ActionPayload.get("emailinput") ?? "noemail";
  const password = ActionPayload.get("pass1") ?? "nopassword";
  const age = ActionPayload.get("ageId") ?? "";
  //const age = "abc";

  // if ((age as string).length > 0) {
  //   return { status: "error" };
  // }

  const res = await handlerUserWithCookie({
    email: email as string,
    pass: password as string,
    age: age as string,
  });

  await Wait(1200);
  return res.status === "ok" ? { status: "ok" } : { status: "error" };
}

const ComponentMayjor = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [state, dispath] = useReducer(ImageReducer, InitState);
  const [currentState, dispatchAction, isPending] = useActionState(
    checkManager,
    InitFormState,
  );
  const [formError, setFormError] = useState<string>("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  useMemo(() => {
    switch (currentState.status) {
      case "error": {
        setFormError("Ошибка! Проверьте данные... или повторите позже.");
        break;
      }
      case "ok": {
        setFormError("Ok");
        break;
      }
      default: {
        setFormError("");
        break;
      }
    }
  }, [currentState]);

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (currentState.status === "ok") {
      //console.log("---Route---");

      router.push(managerInitRequest);
    }
  }, [currentState]);

  if (!isMounted) {
    return null;
  }

  return (
    <article className="w-full min-h-80 max-w-sm mx-auto flex flex-col ">
      <header></header>
      <main className="flex-1">
        <div className=" relative z-0">
          <div className="w-full max-w-120 max-h-90 z-1 object-cover">
            <img
              key={gifBack}
              src={gifBack}
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="block w-full h-full"
            />
          </div>
          {state.step >= 0 && (
            <div className=" absolute top-0 left-0 w-full max-w-120 max-h-90 z-2 object-cover">
              <img
                key={state.imageSrc}
                src={state.imageSrc}
                alt=""
                fetchPriority="low"
                loading="lazy"
                decoding="async"
                className="block w-full h-full"
              />
            </div>
          )}
        </div>
        <form
          ref={formRef}
          className=" w-fit mx-auto text-xs"
          action={dispatchAction}
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   //handlerFormAction();
          // }}
        >
          <fieldset className="group p-2 mt-6 flex flex-col gap-y-10 items-center border border-stone-200 dark:border-stone-600 focus-within:border-accent">
            <legend
              className={cn(
                " text-xs",
                state.step === 1 || state.step === 2
                  ? "text-accent"
                  : "text-stone-300 dark:text-stone-600",
              )}
            >
              &nbsp;Авторизация&nbsp;{" "}
            </legend>
            <label htmlFor="emailinput">
              <input
                type="email"
                name="emailinput"
                id="emailinput"
                className="p-1 w-full max-w-xs outline-0 border dark:border-stone-600 focus:border-accent disabled:text-stone-500/50"
                placeholder="e-mail ..."
                disabled={isPending}
                onBlur={() => dispath({ type: "wait" })}
                onFocus={() => {
                  dispath({ type: "hired" });
                  InitFormState.status = "null";
                }}
              />
            </label>
            <label htmlFor="pass1">
              <input
                type="password"
                name="pass1"
                id="pass1"
                minLength={8}
                className="p-1 w-full max-w-xs outline-0 border dark:border-stone-600 focus:border-accent disabled:text-stone-500/50"
                placeholder="Пароль(от 8-ми символов) ..."
                disabled={isPending}
                onBlur={() => dispath({ type: "wait" })}
                onFocus={() => {
                  dispath({ type: "button" });
                  InitFormState.status = "null";
                }}
              />
            </label>
            <label htmlFor="afeId" className=" hidden">
              <input
                type="text"
                name="ageId"
                id="ageId"
                className=" p-1 w-full max-w-xs outline-0 border dark:border-stone-600 focus:border-accent disabled:text-stone-500/50"
                placeholder="Возраст..."
                disabled={isPending}
              />
            </label>

            {currentState.status !== "null" && (
              <span
                className={cn(
                  "p-1 text-xs uppercase",
                  currentState.status === "ok"
                    ? "text-success"
                    : "text-red-500",
                )}
              >
                {formError}
              </span>
            )}

            <Button
              size="sm"
              variant="outline"
              type="submit"
              isDisabled={isPending}
              className={cn(
                "place-self-end ml-auto text-xs scale-90 active:scale-80 ",
                state.step === 1 || state.step === 2
                  ? "border-accent"
                  : "border-stone-300 dark:border-stone-600",
              )}
            >
              {isPending ? (
                <Loader size={14} className=" animate-spin" />
              ) : (
                <Server size={14} />
              )}
              {isPending ? "Обмен данными..." : "Подтвердить"}
            </Button>
          </fieldset>
        </form>
      </main>
      <footer></footer>
    </article>
  );
};

export default ComponentMayjor;
