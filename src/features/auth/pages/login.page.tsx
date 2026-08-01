import { LoginForm } from "../forms/login.form";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <div className="mx-auto mb-6 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <img
              src="/logo.png"
              alt="ABC-School logo"
              className="size-10 rounded-lg object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to ABC-School
          </h1>
          <p className="text-sm text-muted-foreground">
            School Management System
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-md">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          ABC-School &mdash; School Management System
        </p>
      </div>
    </div>
  );
}
