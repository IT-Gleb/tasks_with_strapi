import SearchedTableProvider from "@/entityes/components/search/SearchedTable";
// import getCacheQueryClient from "@/entityes/providers/getQueryCache";
// import { API_URL } from "@/shared/utils/consts";
// import { fetchGet } from "@/shared/utils/fetchers";
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
  const search = await searchParams;

  if (search) {
    return <SearchedTableProvider />;
  }
  return <div className="w-fit mx-auto">Нет данных для поиска</div>;
}
