export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-stage">
      <div className="page-fade">{children}</div>
    </div>
  );
}