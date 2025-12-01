import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, subject, message, recaptchaToken } = body

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Verify reCAPTCHA
        if (!recaptchaToken) {
            return NextResponse.json(
                { success: false, error: 'reCAPTCHA verification required' },
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
        const apiUrl = `${wordpressUrl}/wp-json/nextjs/v1/contact`

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                subject,
                message
            }),
        })

        const responseData = await response.json()

        if (!response.ok || !responseData.success) {
            console.error('WordPress submission failed:', responseData)
            throw new Error(responseData.message || 'Failed to send message')
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('Contact form submission saved to WordPress')
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for your message. We\'ll get back to you soon!'
        })

    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to send message' },
            { status: 500 }
        )
    }
}
