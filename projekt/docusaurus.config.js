const config = {
  title: 'Cheese API Documentation',
  tagline: 'Documentation for the Cheese API',
  url: 'http://localhost:3000',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 's25867',
  projectName: 'cheese-api',

  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Cheese API',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/api-docs',
          label: 'API Reference',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Cheese API. Built with Docusaurus.`,
    },
  },
};

module.exports = config;
