import Link from "next/link";

export default async function AuthPage() {
  return (
    <section className="w-full p-1">
      <p>Страница, для логина</p>
      <Link href={"/dashboard"} className="hover:underline">
        Перейти
      </Link>
    </section>
  );
}
