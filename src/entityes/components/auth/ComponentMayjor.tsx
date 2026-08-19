"use client";

import { Button } from "@heroui/react";

import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";

const images = [
  { src: "/images/form_manager/back_with_mafon.gif", duration: 5000 },
  { src: "/images/form_manager/men_visibility.gif", duration: 4400 },
  { src: "/images/form_manager/men_hiered.gif", duration: 5000 },
  { src: "/images/form_manager/body_2.gif", duration: 5000 },
];

type TImagesState = {
  step: number;
  imageSrc: string;
  duration: number;
};

type TAction =
  | { type: "initial" }
  | { type: "visibility" }
  | { type: "next" }
  | { type: "setStep"; payload: { step: number; duration: number } };

const InitState: TImagesState = {
  step: 1,
  imageSrc: images[1].src,
  duration: images[1].duration,
};

const ImageReducer = (state: TImagesState, action: TAction): TImagesState => {
  switch (action.type) {
    case "initial":
      return {
        ...state,
        step: 0,
        imageSrc: images[0].src,
        duration: images[0].duration,
      };
    case "visibility":
      return {
        ...state,
        step: 1,
        imageSrc: images[1].src,
        duration: images[1].duration,
      };
    case "next":
      let t_step = state.step + 1;
      if (t_step > images.length - 1) {
        t_step = 1;
      }
      return {
        ...state,
        step: t_step,
        imageSrc: images[t_step].src,
        duration: images[t_step].duration,
      };

    case "setStep": {
      return {
        ...state,
        step: action.payload.step,
        duration: action.payload.duration,
      };
    }
    default:
      // Exhaustiveness check: Ensures all switch cases are handled
      //const _exhaustiveCheck: never = action;
      return state;
  }
};

const ComponentMayjor = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [state, dispath] = useReducer(ImageReducer, InitState);
  const timer = useRef<number | null>(null);

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    //let tmp_id = state.step;

    timer.current = window.setTimeout(() => {
      dispath({ type: "next" });
    }, state.duration);

    return () => {
      //console.log("---return timeout---");

      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
      timer.current = null;
    };
  }, [state]);

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
              src={images[0].src}
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="block w-full h-full"
            />
          </div>
          {state.step > 0 && (
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
        <div className="p-2 mt-6 flex gap-x-10 items-center w-fit mx-auto">
          <Button size="sm" onPress={() => dispath({ type: "visibility" })}>
            Предыдущая
          </Button>
          <Button
            size="sm"
            onPress={() => {
              dispath({ type: "next" });
            }}
          >
            Следуюшая
          </Button>
        </div>
      </main>
      <footer></footer>
    </article>
  );
};

export default ComponentMayjor;
