import React from "react";
import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>;
}
