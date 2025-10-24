import NavBar from "@/components/NavBar/NavBar";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavBar>{children}</NavBar>;
}
