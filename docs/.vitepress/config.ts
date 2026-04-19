import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AvaLangGraph",
  description: "Documentation for the AvaLangGraph Agentic Flow Ecosystem",
  lang: 'en-US',
  base: '/graph.avalangstack.sanctuaireagentique.com/', // Set base URL for deployment on subdomain
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }] // Add a favicon
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is AvaLangGraph?', link: '/' },
          { text: 'Getting Started', link: '/getting-started' }
        ]
      },
      {
        text: 'Core Packages',
        items: [
          { text: 'Inquiry Routing Engine', link: '/packages/inquiry-routing-engine' },
          { text: 'Prompt Decomposition Engine', link: '/packages/prompt-decomposition-engine' },
          { text: 'Narrative Intelligence', link: '/packages/narrative-intelligence' }
        ]
      },
      {
        text: 'RISE Specifications',
        items: [
          { text: 'RISE Framework Overview', link: '/rispecs/README' },
          { text: 'Inquiry Routing Engine (01)', link: '/rispecs/01-inquiry-routing-engine.spec' },
          { text: 'Prompt Decomposition Engine', link: '/rispecs/prompt-decomposition-engine/prompt-decomposition-engine.spec' },
          { text: 'Narrative Intelligence', link: '/rispecs/narrative-intelligence/narrative-intelligence.spec' },
          { text: 'LLMs Overview (Concise)', link: '/llms' },
          { text: 'LLMs Overview (Full)', link: '/llms-full' }
        ]
      },
      {
        text: 'Original LangGraph Resources',
        items: [
          { text: 'Adopters', link: '/content/adopters' },
          { text: 'Agents', link: '/content/agents/' },
          { text: 'Concepts', link: '/content/concepts/' },
          { text: 'How-Tos', link: '/content/how-tos/' },
          { text: 'Tutorials', link: '/content/tutorials/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/avadisabelle/avalanggraph' }
    ],

    footer: {
      message: 'Built with VitePress. Agentic Flow Ecosystem by AvaLangGraph.',
      copyright: 'Copyright © 2024 Ava Isabelle'
    }
  }
})
