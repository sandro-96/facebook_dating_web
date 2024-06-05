const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

let links = [
    { url: '/', changefreq: 'daily', priority: 0.8 },
    { url: '/home', changefreq: 'daily', priority: 0.8 },
    { url: '/chat/public', changefreq: 'daily', priority: 0.8 },
    { url: '/home/nearby', changefreq: 'daily', priority: 0.8 },
    { url: '/chat', changefreq: 'daily', priority: 0.8 },
    { url: '/match', changefreq: 'daily', priority: 0.8 },
    { url: '/match/filter', changefreq: 'daily', priority: 0.8 },
    { url: '/setting', changefreq: 'daily', priority: 0.8 },
    { url: '/setting/profile', changefreq: 'daily', priority: 0.8 },
    { url: '/setting/feedback', changefreq: 'daily', priority: 0.8 },
    { url: '/setting/support', changefreq: 'daily', priority: 0.8 }
];

let sitemap = new SitemapStream({ hostname: 'https://www.fdating.online' });

links.forEach(link => {
    sitemap.write(link);
});

sitemap.end();

// This will generate a sitemap.xml file in your project root.
streamToPromise(sitemap)
    .then(sitemap => {
        createWriteStream('./public/sitemap.xml').write(sitemap.toString());
    })
    .catch(console.error);