"use client";

import AppLayout from "@/components/AppLayout";
import { type ReactNode } from "react";

export default function ExpertLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
