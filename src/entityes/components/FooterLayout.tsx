import { Description } from "@heroui/react";
import GradientLine from "./ui/gradients/GradientLine";

export default function FooterLayout() {
  return (
    <footer className="layout_footer ">
      <GradientLine />
      <div className="w-fit mx-auto text-center mt-1">
        <Description>
          &copy;&nbsp;Gleb Torgashin 2000-
          {Intl.DateTimeFormat("ru-RU", { year: "numeric" }).format(Date.now())}
          г.г.
        </Description>
      </div>
    </footer>
  );
}
