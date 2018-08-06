const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)


exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions

    if (node.internal.type === 'MarkdownRemark') {
        const slug = createFilePath({
            node,
            getNode,
            basePath: 'posts/'
        })
        createNodeField({
            node,
            name: 'slug',
            value: slug
        })
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return graphql(`
        {
          allMarkdownRemark {
            edges {
              node {
                fields {
                  slug
                }
              }
            }
          }
        }
    `).then(result => {
        const posts = result.data.allMarkdownRemark.edges

        posts.forEach(({ node }) => {
            const slug = node.fields.slug
            createPage({
                path: slug,
                component: path.resolve('./src/templates/post.js'),
                context: {
                    slug: slug
                }
            })
        })
    })
}