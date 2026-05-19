import type { ReactNode } from "react";
import { Level1AudioSpeedProvider } from "@/components/public-vocab/level1-ui/Level1AudioSpeedContext";

export default function Level1VocabLayout({ children }: { children: ReactNode }) {
  return <Level1AudioSpeedProvider>{children}</Level1AudioSpeedProvider>;
}
