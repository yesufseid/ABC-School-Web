import type { PrincipalFormValues } from "./schema";

export interface PrincipalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  principalId?: string | null;
  onSubmit: (values: PrincipalFormValues) => void;
  isPending: boolean;
}
