"use client";

import { useEffect, useState } from "react";
import { useBasket } from "./basketStore";

const useBasketHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  //   useEffect(() => {
  //     useBasket.persist.rehydrate();
  //   }, []);

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useBasket.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = useBasket.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useBasket.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

export const HydrationBasketStore = () => {
  const hydrate = useBasketHydration();
  //const _hasHydrated = useBasket((state) => state._hasHydrated);

  useEffect(() => {
    useBasket.persist.rehydrate();
  }, []);

  useEffect(() => {
    //console.log(hydrate, _hasHydrated);

    if (hydrate) {
      useBasket.getState().getFromBase();

      //console.log(useBasket.getState().length);
    }
  }, [hydrate]);

  return null;
};

function useBasketHydrated<T>(selector: (state: any) => T): T | undefined {
  const storeData = useBasket(selector);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 1. Включаем ручную загрузку данных из IndexedDB
    useBasket.persist.rehydrate();

    // 2. Ждем, пока Zustand подтвердит, что данные успешно синхронизированы
    const unsubHydrate = useBasket.persist.onHydrate(() =>
      setIsHydrated(false),
    );
    const unsubFinishHydrate = useBasket.persist.onFinishHydration(() =>
      setIsHydrated(true),
    );

    // На случай, если гидратация уже завершилась к моменту вызова эффекта
    if (useBasket.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubHydrate();
      unsubFinishHydrate();
    };
  }, []);

  // Пока данные из IndexedDB не прилетели — возвращаем undefined (или дефолт)
  return isHydrated ? storeData : undefined;
}

export default useBasketHydration;
