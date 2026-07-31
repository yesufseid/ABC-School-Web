import { useState } from "react";
import { Controller } from "react-hook-form";
import { SearchIcon, PlusIcon, TrashIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useSearchParents } from "../../../api/registration.api";
import type { Parent } from "../../../types/registration.types";
import type { ParentsFieldsProps } from "../types";
import type { ParentFormValues } from "../schema";

const EMPTY_PARENT: ParentFormValues = {
  phoneNumber: "",
  name: "",
  sex: "Male",
  address: "",
  nationality: "Ethiopian",
  relation: "Guardian",
  isPrimary: true,
};

export function ParentsFields({
  control,
  errors,
  fields,
  append,
  remove,
}: ParentsFieldsProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState<{ phone?: string; name?: string }>({});

  const { data: searchData, isLoading: searching } = useSearchParents(
    Object.keys(query).length > 0 ? query : undefined,
  );
  const results = searchData?.data ?? [];

  const handleSearch = () => {
    if (phone.trim() || name.trim()) {
      setQuery({
        phone: phone.trim() || undefined,
        name: name.trim() || undefined,
      });
    } else {
      setQuery({});
    }
  };

  const addResult = (parent: Parent) => {
    append({
      phoneNumber: parent.phoneNumber,
      name: parent.name,
      sex: parent.sex,
      address: parent.address ?? "",
      nationality: parent.nationality ?? "Ethiopian",
      relation: parent.relation ?? "Guardian",
      isPrimary: fields.length === 0,
    });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">
          Search existing parents
        </p>
        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              placeholder="e.g. Girma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">
              Phone
            </label>
            <Input
              placeholder="e.g. 0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button type="button" variant="outline" onClick={handleSearch}>
            {searching ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <SearchIcon />
            )}
            Search
          </Button>
        </div>

        {results.length > 0 && (
          <div className="mt-3 divide-y divide-border rounded-lg border border-border/50">
            {results.map((parent) => (
              <div
                key={parent.id ?? parent.phoneNumber}
                className="flex items-center justify-between gap-2 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{parent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {parent.phoneNumber} · {parent.relation ?? "Guardian"}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addResult(parent)}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Parents</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...EMPTY_PARENT, isPrimary: fields.length === 0 })}
        >
          <PlusIcon />
          Add Parent
        </Button>
      </div>

      {errors.parents?.message && (
        <p className="text-sm text-destructive">{errors.parents.message}</p>
      )}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No parents added yet. Add a parent manually or search for an existing
          one.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-3 rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Parent {index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => remove(index)}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Controller
              control={control}
              name={`parents.${index}.name`}
              render={({ field: parentField }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    placeholder="e.g. Girma Beyene"
                    aria-invalid={!!errors.parents?.[index]?.name}
                    {...parentField}
                  />
                  {errors.parents?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.parents[index].name.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name={`parents.${index}.phoneNumber`}
              render={({ field: parentField }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="e.g. 0912345678"
                    aria-invalid={!!errors.parents?.[index]?.phoneNumber}
                    {...parentField}
                  />
                  {errors.parents?.[index]?.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {errors.parents[index].phoneNumber.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name={`parents.${index}.sex`}
              render={({ field: parentField }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Sex
                  </label>
                  <Select {...parentField}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={control}
              name={`parents.${index}.relation`}
              render={({ field: parentField }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Relation
                  </label>
                  <Select {...parentField}>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={control}
              name={`parents.${index}.address`}
              render={({ field: parentField }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Address
                  </label>
                  <Input
                    placeholder="e.g. Addis Ababa"
                    aria-invalid={!!errors.parents?.[index]?.address}
                    {...parentField}
                  />
                  {errors.parents?.[index]?.address && (
                    <p className="text-sm text-destructive">
                      {errors.parents[index].address.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name={`parents.${index}.nationality`}
              render={({ field: parentField }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nationality
                  </label>
                  <Input
                    placeholder="e.g. Ethiopian"
                    aria-invalid={!!errors.parents?.[index]?.nationality}
                    {...parentField}
                  />
                  {errors.parents?.[index]?.nationality && (
                    <p className="text-sm text-destructive">
                      {errors.parents[index].nationality.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
