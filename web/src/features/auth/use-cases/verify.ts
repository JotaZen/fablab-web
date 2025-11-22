import type { LoginRepository } from "@/features/auth/domain/loginRepository";

// Factory that creates a verify token use-case bound to a concrete repository.
// The use-case itself depends only on the domain contract (`LoginRepository`).
export function createVerifyUseCase(repo: LoginRepository) {
  return async function verifyToken(token: string) {
    try {
      const user = await repo.me(token);
      return { user };
    } catch (err) {
      return { user: null };
    }
  };
}

export type { LoginRepository };
