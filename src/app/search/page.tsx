import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { API_URL } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import { Metadata, ResolvingMetadata } from "next";

type TProps = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(
  searchParams: TProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  //console.log(date);

  //console.log(date, dt);

  return {
    title: "Поиск задач",
  };
}

export default async function SearchedPage({
  searchParams,
}: {
  searchParams: TProps;
}) {
  const serch = await searchParams;
  const params = new URLSearchParams();
  //console.log(serch);

  Object.keys(serch).map((item, index) =>
    params.append(item, serch[item] as string),
  );

  const url = `${API_URL}/todo-search?${params.toString()}`;
  //console.log(url);

  const query = getCacheQueryClient();
  const response = await query.fetchQuery({
    queryKey: ["search", params.toString()],
    queryFn: async () => {
      return await fetchGet<{
        data:
          | {
              id: string;
              documentId: string;
              title: string;
              updated: Date | string;
            }[]
          | { error: boolean; name: string; message: string };
      }>(url);
    },
  });

  if (response == null || "error" in response.data) {
    return <div className="p-2 w-fit mx-auto">Ошибка получения данных.</div>;
  }

  if (response && response.data.length < 1) {
    return (
      <div className="mt-1 p-2 w-fit mx-auto">
        <h3 className=" font-bold text-sky-700 dark:text-sky-400">
          Данные не найдены
        </h3>
      </div>
    );
  }

  return (
    <div>
      {response &&
        response.data.length > 0 &&
        response.data.map((item) => {
          return (
            <div key={item.documentId} className=" grid grid-cols-2 p-1">
              <div>{item.title}</div>
              <div>{item.updated as string}</div>
            </div>
          );
        })}
    </div>
  );
}
