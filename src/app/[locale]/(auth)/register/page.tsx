import { RegisterForm } from "@/features/auth";

interface RegisterPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const redirectUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : undefined;

  return <RegisterForm redirectUrl={redirectUrl} />;
}
