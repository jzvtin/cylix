import { redirect } from "next/navigation"

import { isAdminAuthenticated } from "@lib/admin-auth"
import LoginForm from "./login-form"

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin")
  }

  return <LoginForm />
}
