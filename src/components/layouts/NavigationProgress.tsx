import { useNavigation } from "react-router";

export function NavigationProgress() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (!isLoading) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent">
      <div className="h-full w-full animate-pulse bg-primary transition-all duration-500" />
    </div>
  );
}
