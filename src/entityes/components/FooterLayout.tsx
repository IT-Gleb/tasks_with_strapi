import { Description } from "@heroui/react";
import GradientLine from "./ui/gradients/GradientLine";

export default function FooterLayout() {
  return (
    <footer className="w-full p-1">
      <GradientLine />
      <div className="w-fit mx-auto text-center p-1 align-middle mb-2 ">
        <Description>
          &copy;&nbsp;Gleb Torgashin 2000-
          {Intl.DateTimeFormat("ru-RU", { year: "numeric" }).format(Date.now())}
          г.г.
        </Description>
      </div>
    </footer>
  );
}
