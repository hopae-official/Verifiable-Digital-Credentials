import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

console.log('BASE_URL: ', process.env.BASE_URL);

const config: Config = {
  title: 'Verifiable Digital Credentials (VDCs)',
  tagline: 'The Simplest Wallet SDK',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://vdcs.js.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.BASE_URL || '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Lukas.J.Han', // Usually your GitHub org/user name.
  projectName: 'Verifiable Digital Credentials', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hopae-official/Verifiable-Digital-Credentials/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hopae-official/Verifiable-Digital-Credentials/tree/main/docs/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/card.png',
    navbar: {
      title: 'Verifiable Digital Credentials (VDCs)',
      logo: {
        alt: 'Verifiable Digital Credentials (VDCs) Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Get Started',
        },
        {
          type: 'docSidebar',
          sidebarId: 'issuerSidebar',
          position: 'left',
          label: 'Issuer',
        },
        {
          type: 'docSidebar',
          sidebarId: 'idWalletSidebar',
          position: 'left',
          label: 'ID Wallet(Holder)',
        },
        {
          type: 'docSidebar',
          sidebarId: 'verifierSidebar',
          position: 'left',
          label: 'Verifier',
        },
        {
          type: 'docSidebar',
          sidebarId: 'libsSidebar',
          position: 'left',
          label: 'Libs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/hopae-official/Verifiable-Digital-Credentials',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/yjvGPd5FCU',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/hopae-official/Verifiable-Digital-Credentials',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Verifiable Digital Credentials(VDCs). Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
