import type { ReactNode } from "react";

interface DetailItemProps {
  label: string;
  value?: ReactNode;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "-"}</p>
    </div>
  );
}
