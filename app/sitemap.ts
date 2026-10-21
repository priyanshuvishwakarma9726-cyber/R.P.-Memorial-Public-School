import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rpmpublicschool.in";
  const routes = [
    "",
    "/about",
    "/principal",
    "/academics",
    "/faculty",
    "/infrastructure",
    "/admissions",
    "/notices",
    "/events",
    "/gallery",
    "/results",
    "/downloads",
    "/contact",
    "/calendar",
    "/faq",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/notices" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/admissions" ? 0.9 : 0.8,
  }));
}
