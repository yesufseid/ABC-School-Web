import { LoaderCircleIcon, BookOpenIcon, CalendarDaysIcon } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchMyTeacher } from "../api/teachers.api";

export function MyClassesPage() {
  const { data, isLoading, isError } = useFetchMyTeacher();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-destructive">Failed to load your classes.</p>
      </div>
    );
  }

  const { sections, summary } = data.data;

  const summaryCards = [
    {
      label: "My Sections",
      value: summary.mySections,
      icon: CalendarDaysIcon,
    },
    {
      label: "My Students",
      value: summary.myStudents,
      icon: BookOpenIcon,
    },
    {
      label: "My Subjects",
      value: summary.mySubjects,
      icon: BookOpenIcon,
    },
    {
      label: "Periods / Week",
      value: summary.weeklyPeriods,
      icon: CalendarDaysIcon,
    },
  ];

  const sectionsByClass = new Map<number, typeof sections>();

  sections.forEach((section) => {
    const list = sectionsByClass.get(section.grade) ?? [];
    list.push(section);
    sectionsByClass.set(section.grade, list);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description="Your assigned sections and subjects."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <card.icon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <LoaderCircleIcon className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            You are not assigned to any sections yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(sectionsByClass.entries())
            .sort(([a], [b]) => a - b)
            .map(([grade, classSections]) => (
              <div key={grade} className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Grade {grade}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {classSections.map((section) => (
                    <Card key={`${section.sectionId}-${section.subjectId}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-foreground">
                            Section {section.sectionName}
                          </p>
                          {section.isHomeroom && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Homeroom
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {section.subjectName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}