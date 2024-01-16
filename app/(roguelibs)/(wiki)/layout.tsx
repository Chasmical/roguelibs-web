import WikiLayout from "@components/WikiLayout";

export default function WikiLayoutIndex({ children }: React.PropsWithChildren) {
  return (
    <WikiLayout>{children}</WikiLayout>
  );
}
