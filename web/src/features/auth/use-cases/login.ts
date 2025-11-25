import type { LoginRepository } from "@/features/auth/domain/loginRepository";
import type { LoginCreds } from "@/features/auth/domain/authAdapter";

// Factory that creates a login use-case bound to the provided repository.
export function createLoginUseCase(repo: LoginRepository) {
  return async function loginUseCase(creds: LoginCreds) {
    if (!repo.login) throw new Error("Adapter does not support login");
    return await repo.login(creds);
  };
}

export type { LoginRepository, LoginCreds };
