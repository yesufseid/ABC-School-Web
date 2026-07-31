import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  FileTextIcon,
  PresentationIcon,
  ClipboardListIcon,
  PlayCircleIcon,
  LinkIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { useFetchMaterials } from "../api/materials.api";
import type { MaterialType } from "../types/material.types";

const TYPE_META: Record<MaterialType, { icon: typeof FileTextIcon; label: string; badge: "default" | "secondary" | "warning" | "success" }> = {
  document: { icon: FileTextIcon, label: "Document", badge: "secondary" },
  slides: { icon: PresentationIcon, label: "Slides", badge: "warning" },
  worksheet: { icon: ClipboardListIcon, label: "Worksheet", badge: "success" },
  video: { icon: PlayCircleIcon, label: "Video", badge: "default" },
  link: { icon: LinkIcon, label: "Link", badge: "default" },
};

const TYPE_ORDER: MaterialType[] = ["document", "slides", "worksheet", "video", "link"];

export function MaterialsPage() {
  const { tenantId, role } = useAuthContext();
  const isAdminOrOwner = role === "Admin" || role === "Owner";

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const { data } = useFetchMaterials();
  const materials = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const grades = useMemo(
    () => Array.from(new Set(materials.map((m) => m.grade))).sort((a, b) => a - b),
    [materials],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return materials.filter((m) => {
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      const matchesType = !typeFilter || m.type === typeFilter;
      const matchesGrade = !gradeFilter || String(m.grade) === gradeFilter;
      return matchesSearch && matchesType && matchesGrade;
    });
  }, [materials, search, typeFilter, gradeFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Materials" description="Learning resources for all subjects">
        <ContextSelector
          branches={
            isAdminOrOwner
              ? branches.map((b) => ({ id: b.id, name: b.name }))
              : undefined
          }
        />
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="w-40"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {TYPE_ORDER.map((type) => (
            <option key={type} value={type}>
              {TYPE_META[type].label}
            </option>
          ))}
        </Select>
        <Select
          className="w-40"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">All grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </Select>
        <p className="ml-auto text-sm text-muted-foreground">
          {filtered.length} material{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No materials match your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((material) => {
            const meta = TYPE_META[material.type];
            const Icon = meta.icon;
            return (
              <Card key={material.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <Badge variant={meta.badge}>{meta.label}</Badge>
                  </div>

                  <div>
                    <h3 className="font-medium leading-snug text-foreground">
                      {material.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {material.description}
                    </p>
                  </div>

                  <div className="mt-auto space-y-1 text-sm text-muted-foreground">
                    <p>
                      {material.subject} · Grade {material.grade}
                    </p>
                    <p>{material.branch}</p>
                    <p>
                      {material.uploadedBy} ·{" "}
                      {format(parseISO(material.uploadedAt), "MMM d, yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      {material.size} · {material.downloads} downloads
                    </span>
                    <Button size="sm" variant="outline">
                      <DownloadIcon />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
