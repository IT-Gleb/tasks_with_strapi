import getCacheQueryClient from "@/entityes/providers/getQueryCache";
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

  const url = `http://localhost:1337/api/todo-search?${params.toString()}`;
  //console.log(url);

  const query = getCacheQueryClient();
  const response = await query.fetchQuery({
    queryKey: ["search", params.toString()],
    queryFn: async () => {
      return await fetchGet<{ data: Record<string, string>[] }>(url);
    },
  });

  return (
    <div>
      {serch &&
        response &&
        response.data.map((item, index) => {
          const keys = Object.keys(item);
          return (
            <div key={index}>
              <span>{keys[0]}</span> : {decodeURI(item[keys[0]])}
            </div>
          );
        })}
    </div>
  );
}
