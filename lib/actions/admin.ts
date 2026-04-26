"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: "admin" | "user") {
  const supabase = await createServerClient();

  // Validate that the current user is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    throw new Error("Unauthorized: Only admins can change roles");
  }

  // Update the role in the profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile role:", profileError.message);
    return { success: false, error: profileError.message };
  }

  // Note: Updating auth.users metadata usually requires the service_role key 
  // or using the Supabase Management API. Since we are using the user's client,
  // we might need a separate service client here for metadata sync.
  // For now, the profile update is done. 
  // TODO: Implement metadata sync using a service role client if needed.

  revalidatePath("/admin/users");
  return { success: true };
}
