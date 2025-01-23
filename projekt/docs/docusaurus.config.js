module.exports = {
  title: 'Cheese API Documentation',
  tagline: 'Documentation for the Cheese API',
  url: 'http://localhost:3000',
  baseUrl: '/',
  organizationName: 's25867',
  projectName: 'cheese-api',
  themeConfig: {
    navbar: {
      title: 'Cheese API',
      items: [
        {
          to: 'docs/intro',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'api-docs',
          label: 'API',
          position: 'left',
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
      },
    ],
  ],
};
