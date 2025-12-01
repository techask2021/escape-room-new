import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BlogPost } from '@/lib/wordpress/api'

interface BlogSectionProps {
  posts: BlogPost[]
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Latest Escape Room Tips & Guides
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Expert insights, strategies, and reviews to help you master any escape room challenge
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.id} className="bg-white border-2 border-slate-200 hover:border-escape-red/30 transition-all duration-200 overflow-hidden group h-full flex flex-col">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.slice(0, 2).map((category) => (
                      <Badge key={category.id} variant="secondary" className="bg-escape-red/10 text-escape-red border-escape-red/20 text-xs">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-escape-red transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div
                    className="text-slate-700 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />

                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="border-escape-red text-escape-red hover:bg-escape-red hover:text-white w-full">
                      Read More
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" className="bg-escape-red hover:bg-escape-red-700 text-white px-8">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
