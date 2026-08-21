import ComponentMayjor from "@/entityes/components/auth/ComponentMayjor";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница авторизации",
  archives: [
    "/images/form_manager/men_hiered.gif",
    "/images/form_manager/men_visibility.gif",
    "/images/form_manager/men_button.gif",
  ],
  other: {
    // Вручную добавляем линк в head
    rel: "preload",
    as: "image",
    href: "/images/form_manager/back_with_mafon.gif",
    type: "image/gif",
  },
};

export default async function AuthPage() {
  return (
    <section className="w-full p-1">
      <ComponentMayjor />
      <Link href={"/dashboard"} className="hover:underline">
        Перейти
      </Link>
    </section>
  );
}
