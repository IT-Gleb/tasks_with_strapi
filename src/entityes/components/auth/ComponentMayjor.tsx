"use client";

import { gifImages } from "@/shared/utils/consts";
import { Button } from "@heroui/react";

import { useEffect, useLayoutEffect, useReducer, useState } from "react";

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

const ComponentMayjor = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [state, dispath] = useReducer(ImageReducer, InitState);

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

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
          className=" w-fit mx-auto text-xs"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <fieldset className="p-2 mt-6 flex flex-col gap-y-10 items-center border border-accent">
            <legend className=" text-accent text-xs"> Авторизация </legend>
            <label htmlFor="emailinput">
              <input
                type="e-mail"
                name="emailinput"
                id="emailinput"
                className="p-1 w-full max-w-xs outline-0 border focus:border-accent"
                placeholder="e-mail ..."
                onBlur={() => dispath({ type: "wait" })}
                onFocus={() => dispath({ type: "hired" })}
              />
            </label>
            <label htmlFor="pass1">
              <input
                type="password"
                name="pass1"
                id="pass1"
                className="p-1 w-full max-w-xs outline-0 border focus:border-accent"
                placeholder="Пароль ..."
                onBlur={() => dispath({ type: "wait" })}
                onFocus={() => dispath({ type: "button" })}
              />
            </label>
          </fieldset>
        </form>
      </main>
      <footer></footer>
    </article>
  );
};

export default ComponentMayjor;
