import React from "react";
import { PropertyFormPage } from "@/components/admin/PropertyFormPage";

export const metadata = {
  title: "Add New Property — LuxState Admin",
};

export default function NewPropertyPage() {
  return <PropertyFormPage mode="create" />;
}
