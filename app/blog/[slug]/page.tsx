import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { getBlogPostBySlug, getRecentBlogPosts } from '@/lib/wordpress/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import BlogSidebar from '@/components/blog-sidebar'
import { getAllEscapeRooms } from '@/lib/wordpress/api'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Strip HTML from excerpt for meta description
  const plainExcerpt = post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160)

  return {
    title: `${post.title} | Escape Rooms Finder Blog`,
    description: plainExcerpt,
    keywords: post.tags.map(tag => tag.name).join(', '),
    openGraph: {
      title: post.title,
      description: plainExcerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      images: post.featuredImage ? [
        {
          url: post.featuredImage.sourceUrl,
          width: post.featuredImage.width || 1200,
          height: post.featuredImage.height || 630,
          alt: post.featuredImage.altText || post.title,
        }
      ] : [],
    },
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const { data: post } = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Get nearby escape rooms for sidebar
  const allRooms = await getAllEscapeRooms()
  const nearbyEscapeRooms = allRooms.slice(0, 5).map(room => ({
    id: room.id,
    name: room.name || '',
    location: `${room.city}, ${room.state}`,
    rating: room.rating || 0,
    difficulty: room.difficulty || 'Medium',
    duration: room.duration || '60 min',
    players: room.team_size || '2-6',
    image: room.photo || '/placeholder-escape-room.jpg',
    city: room.city,
    state: room.state,
    venue_name: room.name
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" className="text-escape-red hover:text-escape-red-700 hover:bg-escape-red/5">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
                  <Image
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Post Header */}
              <Card className="bg-white border-2 border-slate-200 mb-8">
                <CardHeader>
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category) => (
                      <Badge key={category.id} variant="secondary" className="bg-escape-red/10 text-escape-red border-escape-red/20">
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    {post.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      {post.author.avatar && (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Post Content */}
              <Card className="bg-white border-2 border-slate-200 mb-8">
                <CardContent className="p-6 lg:p-8">
                  <div
                    className="prose prose-lg prose-slate max-w-none
                      prose-headings:font-bold prose-headings:text-slate-900
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                      prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2
                      prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2
                      prose-li:text-gray-700 prose-li:leading-relaxed
                      prose-strong:text-slate-900 prose-strong:font-semibold
                      prose-a:text-escape-red prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-lg prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              {post.tags.length > 0 && (
                <Card className="bg-white border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-escape-red" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="border-slate-300 text-slate-700 hover:border-escape-red hover:text-escape-red">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar nearbyEscapeRooms={nearbyEscapeRooms} />
          </div>
        </div>
      </div>
    </div>
  )
}
