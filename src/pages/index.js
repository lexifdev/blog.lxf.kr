import Layout from '../base'

import React from 'react'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'


export const pageQuery = graphql`{
  allMarkdownRemark {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY/MM/DD")
        }
      }
    }
  }
}`


export default ({ data }) => {
    const posts = data.allMarkdownRemark.edges
    const title = 'blog.lxf.kr'

    return (
        <Layout>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:url" content="https://blog.lxf.kr/" />
                <meta property="og:site_name" content="blog.lxf.kr" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="blog.lxf.kr" />
                <meta name="twitter:site" content="@lexifdev" />
                <meta name="twitter:creator" content="@lexifdev" />
                <meta name="twitter:description" content="" />
                <meta name="twitter:image:src" content="" />
            </Helmet>
            <div className="post-list">
                <ul>
                {posts.map(({ node }) => (
                    <li key={node.fields.slug}>
                        <Link to={node.fields.slug}>
                            <span className="date">{node.frontmatter.date}</span>
                            <span className="title">{node.frontmatter.title}</span>
                        </Link>
                    </li>
                ))}
                </ul>
            </div>
        </Layout>
    )
}
