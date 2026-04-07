import { ForceThemeLight } from "@/components/public-vocab/ForceThemeLight";

/**
 * Layout for all public /vocab/* pages.
 * Forces light mode since anonymous visitors have no theme toggle.
 */
export default function VocabPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ForceThemeLight />
      {children}
    </>
  );
}
