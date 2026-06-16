"use client";

import AppLayout from "@/components/AppLayout";
import { type ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
