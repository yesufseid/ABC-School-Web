import { useAppDispatch, useAuthContext } from "@/lib/store";
import {
  setBranchId,
  setYear,
  setTerm,
} from "@/lib/store/slices/prefs.slice";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type BranchOption = {
  id: string;
  name: string;
};

interface ContextSelectorProps {
  branches?: BranchOption[];
  showYear?: boolean;
  showTerm?: boolean;
  className?: string;
}

const TERM_OPTIONS = ["Term 1", "Term 2", "Term 3"];

function yearOptions(): string[] {
  const year = new Date().getFullYear();
  return [String(year - 1), String(year), String(year + 1)];
}

export function ContextSelector({
  branches,
  showYear = true,
  showTerm = true,
  className,
}: ContextSelectorProps) {
  const dispatch = useAppDispatch();
  const { branchId, year, term } = useAuthContext();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {branches && branches.length > 0 && (
        <Select
          aria-label="Branch"
          value={branchId ?? ""}
          onChange={(e) => dispatch(setBranchId(e.target.value))}
        >
          <option value="" disabled>
            Branch
          </option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </Select>
      )}

      {showYear && (
        <Select
          aria-label="Year"
          value={year}
          onChange={(e) => dispatch(setYear(e.target.value))}
        >
          {yearOptions().map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      )}

      {showTerm && (
        <Select
          aria-label="Term"
          value={term}
          onChange={(e) => dispatch(setTerm(e.target.value))}
        >
          {TERM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
