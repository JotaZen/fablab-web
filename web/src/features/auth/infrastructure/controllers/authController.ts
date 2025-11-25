import { getStrapiClient } from "@/features/auth/infrastructure/di";
import { createVerifyUseCase } from "@/features/auth/application/use-cases/verify";
import { createLogoutUseCase } from "@/features/auth/application/use-cases/logout";

// Controller in infrastructure: resolves concrete repo (StrapiClient),
// creates the use-case by injecting the repo, and then executes it.
export async function serverGetSessionFromToken(token: string) {
  const repo = getStrapiClient();
  const verify = createVerifyUseCase(repo);
  return await verify(token);
}

export async function serverLogout() {
  const repo = getStrapiClient();
  const logout = createLogoutUseCase(repo);
  return await logout();
}
