export default function Divider() {
  return (
    <div className="mt-4 grid gap-4">
      <div className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </div>
      <div className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </div>
      <div className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </div>
    </div>
  );
}
