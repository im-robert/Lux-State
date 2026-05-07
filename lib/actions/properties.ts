"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeUniqueSlug(base: string): string {
  return `${slugify(base)}-${Date.now()}`;
}

// ---------------------------------------------------------------------------
// Image upload
// ---------------------------------------------------------------------------

export async function uploadPropertyImages(
  formData: FormData
): Promise<{ urls: string[]; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { urls: [], error: "Unauthorized" };

  const files = formData.getAll("files") as File[];
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) { console.error("Upload error:", error.message); continue; }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);

    urls.push(urlData.publicUrl);
  }

  return { urls };
}

// ---------------------------------------------------------------------------
// Delete image from storage
// ---------------------------------------------------------------------------

export async function deletePropertyImage(
  publicUrl: string
): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const marker = "/property-images/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return { error: "Invalid URL" };
  const path = publicUrl.slice(idx + marker.length);

  const { error } = await supabase.storage.from("property-images").remove([path]);
  if (error) return { error: error.message };
  return {};
}

// ---------------------------------------------------------------------------
// Create property — returns result, NO redirect (caller handles navigation)
// ---------------------------------------------------------------------------

export async function createProperty(
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const title = (formData.get("title") as string).trim();
  const galleryImages = formData.getAll("gallery_images") as string[];

  const payload = {
    title,
    slug: makeUniqueSlug(title),
    location: (formData.get("location") as string) || "",
    price: parseFloat(formData.get("price") as string) || 0,
    price_suffix: (formData.get("price_suffix") as string) || null,
    type: (formData.get("type") as "sale" | "rent") || "sale",
    badge: (formData.get("badge") as string) || null,
    description: (formData.get("description") as string) || null,
    beds: parseInt(formData.get("beds") as string) || 0,
    baths: parseInt(formData.get("baths") as string) || 0,
    parking: parseInt(formData.get("parking") as string) || 0,
    area: parseFloat(formData.get("area") as string) || 0,
    year_built: parseInt(formData.get("year_built") as string) || null,
    is_featured: formData.get("is_featured") === "true",
    latitude: parseFloat(formData.get("latitude") as string) || null,
    longitude: parseFloat(formData.get("longitude") as string) || null,
    amenities: formData.getAll("amenities") as string[],
    gallery_images: galleryImages.length > 0 ? galleryImages : null,
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return { success: true, id: data.id };
}

// ---------------------------------------------------------------------------
// Update property — returns result, NO redirect
// ---------------------------------------------------------------------------

export async function updateProperty(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const title = (formData.get("title") as string).trim();
  const galleryImages = formData.getAll("gallery_images") as string[];

  const payload = {
    title,
    location: (formData.get("location") as string) || "",
    price: parseFloat(formData.get("price") as string) || 0,
    price_suffix: (formData.get("price_suffix") as string) || null,
    type: (formData.get("type") as "sale" | "rent") || "sale",
    badge: (formData.get("badge") as string) || null,
    description: (formData.get("description") as string) || null,
    beds: parseInt(formData.get("beds") as string) || 0,
    baths: parseInt(formData.get("baths") as string) || 0,
    parking: parseInt(formData.get("parking") as string) || 0,
    area: parseFloat(formData.get("area") as string) || 0,
    year_built: parseInt(formData.get("year_built") as string) || null,
    is_featured: formData.get("is_featured") === "true",
    latitude: parseFloat(formData.get("latitude") as string) || null,
    longitude: parseFloat(formData.get("longitude") as string) || null,
    amenities: formData.getAll("amenities") as string[],
    gallery_images: galleryImages.length > 0 ? galleryImages : null,
  };

  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Delete property
// ---------------------------------------------------------------------------

export async function deleteProperty(
  id: string
): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return {};
}
