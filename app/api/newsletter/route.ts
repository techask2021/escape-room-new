import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        // Validate email
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Get WordPress URL from environment
        let wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL
        if (!wordpressUrl) {
            const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || ''
            wordpressUrl = graphqlUrl.replace('/graphql', '')
        }

        // Submit to custom WordPress REST API endpoint
        const apiUrl = `${wordpressUrl}/wp-json/nextjs/v1/newsletter`

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })

        const responseData = await response.json()

        if (!response.ok || !responseData.success) {
            console.error('WordPress submission failed:', responseData)
            throw new Error(responseData.message || 'Failed to subscribe')
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('Newsletter subscription saved to WordPress')
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to newsletter!'
        })

    } catch (error) {
        console.error('Newsletter API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to subscribe to newsletter'
            },
            { status: 500 }
        )
    }
}
