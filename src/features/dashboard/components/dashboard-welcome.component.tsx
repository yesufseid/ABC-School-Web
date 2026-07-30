import { Card, CardContent } from "@/components/ui/card";

type DashboardWelcomeProps = {
  userName: string;
};

export function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  return (
    <Card className="border-border/40 bg-card/80">
      <CardContent className="py-8">
        <h2 className="text-xl font-semibold">Welcome back, {userName}</h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Your personalized dashboard overview will appear here. Check Schedules,
          Academics, and Messages from the sidebar.
        </p>
      </CardContent>
    </Card>
  );
}
