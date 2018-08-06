import Layout from '../base'

import React from 'react'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'


export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      #htmlAst
      #timeToRead
      #tableOfContents
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
      }
    }
  }
`


export default (props) => {
    console.log(props)
    const { data, location } = props
    const { html, frontmatter } = data.markdownRemark
    const { title, date } = frontmatter

    return (
        <Layout>
            <Helmet>
                <title>{title} - blog.lxf.kr</title>
                <meta property="og:title" content={title} />
                <meta property="og:url" content={`https://blog.lxf.kr${location.pathname}`} />
                <meta property="og:site_name" content="blog.lxf.kr" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:site" content="@lexifdev" />
                <meta name="twitter:creator" content="@lexifdev" />
                <meta name="twitter:description" content="" />
                <meta name="twitter:image:src" content="" />
            </Helmet>
            <div className="post">
                <div>
                    <h3 className="date">{date}</h3>
                    <h1 className="title">{title}</h1>
                </div>
                <div className="content" dangerouslySetInnerHTML={{__html: html}} />
            </div>
        </Layout>
    )
}
