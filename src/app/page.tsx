import { redirect } from "next/navigation";

export default async function MainPage() {
  return redirect("/task");
}
