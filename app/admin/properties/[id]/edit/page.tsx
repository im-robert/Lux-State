import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PropertyFormPage } from "@/components/admin/PropertyFormPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Property — LuxState Admin",
};

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) notFound();

  return <PropertyFormPage mode="edit" property={property} />;
}
