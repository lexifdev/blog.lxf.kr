module.exports = {
    siteMetadata: {
        title: `blog.lxf.kr`,
        description: ``,
        siteUrl: `https://blog.lxf.kr`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-catch-links`,
        `gatsby-plugin-stylus`,
        `gatsby-plugin-typography`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: `UA-69269543-1`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `posts`,
                path: `${__dirname}/posts`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    `gatsby-remark-images`,
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-prismjs`,
                ]
            }
        },
        {
            resolve: 'gatsby-plugin-buildtime-timezone',
            options: {
                tz: 'Asia/Seoul',
                format: 'YYYY/MM/DD'
            },
        },
        `gatsby-plugin-feed`
    ]
}
