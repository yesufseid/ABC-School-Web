import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router";
import { useAppDispatch } from "@/lib/store";
import { setCredentials } from "@/lib/store/slices/auth.slice";
import { useLogin } from "../api/auth.api";
import { loginSchema } from "../schemas/login.schema";
import type { LoginFormValues } from "../schemas/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: (data) => {
        const { accessToken, name, phoneNumber, type, subscriptionEndDate } =
          data.data;

        dispatch(
          setCredentials({
            accessToken,
            user: {
              name,
              phoneNumber,
              type,
              subscriptionEndDate,
            },
          }),
        );
        navigate(from, { replace: true });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="phoneNumber"
          className="text-sm font-medium text-foreground"
        >
          Phone Number
        </label>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g. 0912345678"
              aria-invalid={!!errors.phoneNumber}
              {...field}
            />
          )}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              {...field}
            />
          )}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 w-full text-base"
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
