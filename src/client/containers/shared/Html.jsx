//--------------------------------
// This is rendered ONLY on SERVER
//--------------------------------
import React from 'react'
import { inject } from 'mobx-react'

if (process.env.IS_CLIENT===true) throw "React Component <Html/> shouldn't be included in the client"

@inject("coupon","state")
export default class Html extends React.Component {
    render() {
        const coupon = this.props.coupon
        const state = this.props.state

        // Setup devServerURL accordingly ( webpack dev server has a different port )
        const isProd = process.env.NODE_ENV === 'production'
        const devServerURL = isProd ? '/public' : 'http://localhost:5400'



        let injected_state = 'window.__STATE = ' + JSON.stringify(coupon, null, isProd ? 0 : 4) + ';'

		/* eslint-disable react/no-danger */
        return (<html lang="">
                    <head>
                        <title>{coupon.offer.title}</title>
                        <meta charSet="utf-8" />
                        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <meta name="description" content={coupon.offer.description} />
                        <meta name="keywords" content={"dd"} />
                        <meta property="og:title" content={coupon.offer.title} />
                        <meta property="og:description" content={coupon.offer.description} />
                        <meta property="og:url" content={coupon.link} />
                        <meta property="og:image" content={coupon.offer.imageUrl} />
                        <link href={devServerURL + '/bundle.css'} rel="stylesheet"/>
                        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                        <script dangerouslySetInnerHTML={{__html: injected_state}}/>
                    </head>
                    <body>
                        <div id="root">{this.props.children}</div>
                        <script src={devServerURL+'/bundle.js'} />
                    </body>
                </html>)
    }
}