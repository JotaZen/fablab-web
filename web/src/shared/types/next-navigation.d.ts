// Shim to expose next/navigation types explicitly in case the TypeScript
// server can't resolve them automatically. This forwards types to the
// internal declaration exported by Next.
declare module "next/navigation" {
  export * from "next/dist/client/components/navigation";
}
