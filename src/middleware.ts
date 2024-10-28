import { NextResponse, NextRequest } from 'next/server'

const apiUrlStart = process.env.KIBO_API_HOST

const checkIsAuthenticated = (req: NextRequest) => {
  const cookie = req.headers.get('cookie')
  const cookieValue = cookie?.split('kibo_at=')[1]
  const encodedValue = cookieValue?.split(';')[0]
  if (encodedValue) {
    const decodedCookie = JSON.parse(Buffer.from(encodedValue, 'base64').toString('utf8'))
    return decodedCookie?.userId
  }
  return null
}

const fetchApi = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error('API request failed')
  return response.json()
}

const getApiAuthToken = async () => {
  const url = `https://${apiUrlStart}/api/platform/applications/authtickets/oauth`
  const body = JSON.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.KIBO_CLIENT_ID,
    client_secret: process.env.KIBO_SHARED_SECRET,
  })

  const data = await fetchApi(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  return data.access_token
}

// Function to get the current URL with query parameters
const getCurrentUrlWithQueryParams = () => {
  return window.location.href // This gives the full current URL including query params
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (request.nextUrl.pathname.startsWith('/my-account')) {
    if (checkIsAuthenticated(request)) {
      return NextResponse.next()
    }

    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  // Custom routes requests for product page
  if (pathname.startsWith('/p/') || pathname.startsWith('/product/')) {
    const authToken = await getApiAuthToken()
    const urlProductCode = pathname.split('/')[2]

    // Make an Product API call using Fetch
    if (urlProductCode && authToken) {
      try {
        const apiUrl = `https://${apiUrlStart}/api/commerce/catalog/storefront/products/${urlProductCode}`
        const productData = await fetchApi(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        })

        const { productCode, categories, content } = productData || {}
        const categoryCode = categories?.[0]?.categoryCode
        const productSlug = content?.seoFriendlyUrl

        if (urlProductCode === productCode) {
          const slugUrl =
            productSlug && categoryCode
              ? `/products/${categoryCode}/${productSlug}/${productCode}`
              : productCode
              ? `/p/${productCode}`
              : `/product/${productCode}`

          const redirects = await getCustomRedirects()
          const customRedirect = redirects.find((redirect) => redirect.sourceUrl === pathname)

          if (customRedirect) {
            const finalUrl = new URL(customRedirect.destinationUrl, request.url)
            finalUrl.search = search
            return NextResponse.redirect(finalUrl, customRedirect.permanent ? 301 : 302)
          }

          if (slugUrl) {
            const slugRedirectUrl = new URL(slugUrl, request.url)
            slugRedirectUrl.search = search
            const slugRedirect = NextResponse.redirect(slugRedirectUrl)
            slugRedirect.headers.set('Cache-Control', 'no-store')
            return slugRedirect
          }
        }
      } catch (error) {
        console.error(error)
        return NextResponse.next() // Handle error as needed
      }
    }
  }

  async function getCustomRedirects() {
    //custom redirects from builder/io
    const redirectsResult = await fetch(
      `https://cdn.builder.io/api/v3/content/custom-redirects?apiKey=${process.env.BUILDER_IO_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      }
    )
    if (!redirectsResult.ok) {
      console.log('Failed to fetch custom redirects')
      return []
    }
    if (redirectsResult.ok) {
      const data = await redirectsResult.json()
      const dataResult = data.results

      // Extract all redirects from the data.urlList
      const redirects = Array.isArray(dataResult)
        ? dataResult
            .map((content: any) => {
              const urlList = content.data?.urlList || []
              return urlList.map(
                (urlItem: { sourceUrl: any; destinationUrl: any; redirectToPermanent: any }) => ({
                  sourceUrl: urlItem.sourceUrl,
                  destinationUrl: urlItem.destinationUrl,
                  permanent: !!urlItem.redirectToPermanent,
                })
              )
            })
            .flat()
        : []
      return redirects // Return the parsed JSON
    } else {
      return []
    }
  }
}
