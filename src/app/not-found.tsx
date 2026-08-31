import Link from "next/link";
import "@/accets/css/globals.css";
import FooterLayout from "@/entityes/components/FooterLayout";
import HeaderLayout from "@/entityes/components/HeaderLayout";

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <HeaderLayout />
      <main className="flex-1 w-full max-w-xl min-h-[calc(100dvh-var(--minHeaderH)-var(--minFooterH))] mx-auto place-content-center p-1">
        <h1 className="text-3xl">Внимание</h1>
        <p className="text-muted">Такой страницы не существует.</p>
        <Link href={"/"} className="mt-10 text-xs">
          На главную
        </Link>
      </main>
      <FooterLayout />
    </div>
  );
}
