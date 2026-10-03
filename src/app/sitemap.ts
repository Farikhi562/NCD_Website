import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

// Public routes only. /app and /admin are never listed (spec.md §18).
// People stays out until the consent decision D-06 is made.
const routes = ["/", "/about", "/projects", "/competitions", "/knowledge", "/activities", "/transparency", "/archive"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: siteUrl(path) }));
}
