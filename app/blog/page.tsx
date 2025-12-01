import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { getBlogPosts, getRecentBlogPosts } from '@/lib/wordpress/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import BlogSidebar from '@/components/blog-sidebar'
import { getAllEscapeRooms } from '@/lib/wordpress/api'

export const metadata: Metadata = {
  title: 'Escape Room Blog - Tips, Reviews & Guides | Escape Rooms Finder',
  description: 'Discover expert tips, in-depth reviews, and comprehensive guides for escape room enthusiasts. Learn strategies, find the best rooms, and improve your game.',
  keywords: 'escape room blog, escape room tips, escape room reviews, escape room guides, puzzle solving, team building',
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const { data: posts } = await getBlogPosts({ limit: 12 })

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-escape-red to-escape-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Escape Room Blog
            </h1>
            <p className="text-xl text-white/90">
              Expert tips, reviews, and guides to help you master any escape room challenge
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <Card className="bg-white border-2 border-slate-200">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-escape-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Posts Yet</h3>
                  <p className="text-slate-600">Check back soon for exciting escape room content!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-white border-2 border-slate-200 hover:border-escape-red/30 transition-all duration-200 overflow-hidden group">
                    <div className="md:flex">
                      {/* Featured Image */}
                      {post.featuredImage && (
                        <div className="md:w-1/3 flex-shrink-0">
                          <div className="relative h-64 md:h-full overflow-hidden">
                            <Image
                              src={post.featuredImage.sourceUrl}
                              alt={post.featuredImage.altText || post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <CardHeader className="pb-3">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories.slice(0, 2).map((category) => (
                              <Badge key={category.id} variant="secondary" className="bg-escape-red/10 text-escape-red border-escape-red/20">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-escape-red transition-colors mb-3 line-clamp-2">
                              {post.title}
                            </h2>
                          </Link>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div
                            className="text-slate-700 mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                          />

                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" className="border-escape-red text-escape-red hover:bg-escape-red hover:text-white">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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
