export default function StatusMessage({
  type,
  children,
}: {
  type: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  return <div className={`status ${type}`}>{children}</div>;
}