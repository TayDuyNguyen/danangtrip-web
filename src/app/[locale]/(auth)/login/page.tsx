import { LoginForm } from "@/features/auth";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : undefined;

  return <LoginForm redirectUrl={redirectUrl} />;
}
