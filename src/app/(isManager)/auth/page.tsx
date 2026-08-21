import ComponentMayjor from "@/entityes/components/auth/ComponentMayjor";
import { Metadata } from "next";
import { preload } from "react-dom";
import Link from "next/link";
import { gifImages } from "@/shared/utils/consts";

export const metadata: Metadata = {
  title: "Страница авторизации",

  other: {
    // Вручную добавляем линк в head
    rel: "preload",
    as: "image",
    href: "/images/form_manager/back_with_mafon.gif",
    type: "image/gif",
  },
};

export default async function AuthPage() {
  gifImages.forEach((item) =>
    preload(item, { as: "image", type: "image/gif" }),
  );

  return (
    <section className="w-full p-1">
      <ComponentMayjor />
      <Link href={"/dashboard"} className="hover:underline">
        Перейти
      </Link>
    </section>
  );
}
