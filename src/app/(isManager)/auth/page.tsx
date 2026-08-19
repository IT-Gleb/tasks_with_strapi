import ComponentMayjor from "@/entityes/components/auth/ComponentMayjor";
import Link from "next/link";

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
