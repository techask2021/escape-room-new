import { Card, CardContent } from "@/components/ui/card"

interface VenueDescriptionProps {
  description?: string
  postContent?: string
}

export default function VenueDescription({ description, postContent }: VenueDescriptionProps) {
  if (!description && !postContent) return null

  // Prefer postContent (HTML formatted) over description (plain text)
  const content = postContent || description

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardContent className="p-6 lg:p-8">
        <div
          className="venue-content prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-a:text-escape-red prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </CardContent>
    </Card>
  )
}
