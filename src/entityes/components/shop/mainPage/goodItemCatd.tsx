import { TGoodItem } from "@/shared/types/main_types";
import { SERVER_URL } from "@/shared/utils/consts";

const GoodItemCard = ({ item }: { item: TGoodItem }) => {
  const { picture, title, price, description } = item;
  const picUrl = `${SERVER_URL}${picture[0].url}`;

  return (
    <article className="w-40 h-75 p-1.5 text-xs bg-green-400/50 dark:bg-blue-800/50 rounded-2xl overflow-hidden">
      <figure>
        <div className="w-full h-38 object-cover object-center rounded-2xl overflow-hidden">
          <picture>
            <source srcSet={picUrl}></source>
            <img
              src="/window.swg"
              className="w-full h-full"
              decoding="async"
              fetchPriority="low"
              loading="lazy"
            />
          </picture>
        </div>
        <figcaption className="mt-2 flex flex-col gap-y-2 relative z-1">
          <div className="absolute z-5 left-2 -top-6 rotate-6 ">
            <span className="w-fit text-3xl text-green-50 dark:text-blue-100 drop-shadow-[0_3px_2px_rgba(0,0,0,1)] dark:drop-shadow-[0_2px_1px_rgba(0,0,0,1)] font-semibold">
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(price)}
            </span>
          </div>
          <div className="mt-3 h-10 line-clamp-2 p-2 ">{title}</div>
          <div className="h-14 py-1 px-2.5 bg-green-500/75 dark:bg-blue-950/75 rounded-xl overflow-hidden line-clamp-3 indent-2">
            {description}
          </div>
        </figcaption>
      </figure>
    </article>
  );
};

export default GoodItemCard;
