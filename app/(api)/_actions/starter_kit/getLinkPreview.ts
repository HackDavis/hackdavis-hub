"use server";

import { getLinkPreview } from "link-preview-js";
interface LinkPreviewResult {
  url: string;
  title?: string;
  siteName?: string;
  description?: string;
  mediaType?: string;
  contentType?: string;
  images?: string[];
  videos?: any[];
  favicons?: string[];
  charset?: string | null;
}

export async function fetchLinkPreview(url: string) {
  try {
    const data = (await getLinkPreview(url, {
      imagesPropertyType: "og",
      headers: {
        "user-agent": "googlebot",
        "Accept-Language": "en-US",
      },
      followRedirects: "follow",
      timeout: 5000,
    })) as LinkPreviewResult;

    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch preview:", error);
    return {
      ok: false,
      error: "Failed to fetch preview",
    };
  }
}
