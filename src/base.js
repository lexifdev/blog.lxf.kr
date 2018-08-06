import './base.styl'

import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'


export default ({ children }) => (
    <>
        <Helmet>
            <title>blog.lxf.kr</title>
        </Helmet>
        <div id="home">
            <Link className="link" to="/"/>
        </div>
        <div id="body">{children}</div>
    </>
)
