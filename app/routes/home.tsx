import type { Route } from "./+types/home";
import Calculator from "components/calculator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commision simulator" },
    { name: "description", content: "Start with simulation" },
  ];
}

export default function Home() {
  return <Calculator />;
}
