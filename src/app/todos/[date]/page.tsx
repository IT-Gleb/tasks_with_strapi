import { TDateISOString } from "@/shared/types/main_types";

export default async function TodoOnDate({
  params,
}: {
  params: Promise<{ date: TDateISOString }>;
}) {
  const { date } = await params;
  return <div className="fromstart">{date}</div>;
}
