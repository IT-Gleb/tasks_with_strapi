import Link from "next/link";
import "@/accets/css/globals.css";
import FooterLayout from "@/entityes/components/FooterLayout";
import HeaderLayout from "@/entityes/components/HeaderLayout";

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <HeaderLayout />
      <main className="flex-1 w-full max-w-xl min-h-[88vh] mx-auto place-content-center p-1">
        <p>Такой страницы не существует.</p>
        <Link href={"/"} className="mt-10 text-xs">
          На главную
        </Link>
      </main>
      <FooterLayout />
    </div>
  );
}
