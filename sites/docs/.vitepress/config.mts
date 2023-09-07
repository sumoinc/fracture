import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "./src",
  title: "Fracture Framework",
  description: "A Projen Booster",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      /*{ text: "Examples", link: "/examples/" },*/
      { text: "Docs", link: "/docs/" },
    ],

    sidebar: {
      "/docs/": [
        {
          text: "Fracture Basics",
          items: [{ text: "What is Fracture?", link: "/docs/" }],
        },
        {
          text: "Deployments Sites",
          items: [{ text: "Overview", link: "/docs/deployments/" }],
        },
        {
          text: "Data Services",
          items: [{ text: "Overview", link: "/docs/services/" }],
        },
        {
          text: "Static Sites",
          items: [{ text: "Intro", link: "/docs/sites/" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/sumoinc/fracture" },
    ],
  },
});
