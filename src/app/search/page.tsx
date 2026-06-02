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
  //console.log(serch);

  return (
    <div>
      {serch &&
        Object.entries(serch).map((item, index) => (
          <div key={index}>
            {item[0]} : {decodeURI(item[1] as string)}
          </div>
        ))}
    </div>
  );
}
