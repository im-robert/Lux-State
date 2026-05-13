"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";
import { motion } from "framer-motion";

interface AvatarUploadProps {
  currentUrl: string | null;
  userId: string;
}

export default function AvatarUpload({ currentUrl, userId }: AvatarUploadProps) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile in DB
      await updateProfile({ avatar_url: publicUrl });
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      alert(t("profile.error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-[#1a3833] shadow-soft relative">
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-mosque/10 flex items-center justify-center text-mosque">
              <span className="material-symbols-rounded text-5xl">person</span>
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <span className="animate-spin h-8 w-8 border-4 border-white/30 border-t-white rounded-full"></span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-mosque hover:bg-mosque-dark text-white rounded-xl shadow-soft flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <span className="material-symbols-rounded text-xl">photo_camera</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-xs font-bold text-nordic-dark/40 dark:text-gray-400 uppercase tracking-widest">
        {uploading ? t("profile.uploading") : t("profile.changeAvatar")}
      </p>
    </div>
  );
}
