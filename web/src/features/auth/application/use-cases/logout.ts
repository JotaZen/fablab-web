import type { LoginRepository } from "@/features/auth/domain/loginRepository";

export function createLogoutUseCase(repo: LoginRepository) {
  return async function logout() {
    if (typeof repo.logout === "function") {
      await repo.logout();
    }
    // No-op if the repository does not implement logout
    return;
  };
}
