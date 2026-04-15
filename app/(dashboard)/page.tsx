import { redirect } from "next/navigation";

// Redirect to /dashboard — real dashboard is at app/(dashboard)/dashboard/page.tsx
export default function GroupIndexPage() {
  redirect("/dashboard");
}
