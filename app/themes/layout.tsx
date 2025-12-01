import { Metadata } from 'next'
import { getThemesWithCounts } from '@/lib/data-source'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: themes } = await getThemesWithCounts()
    const themeCount = themes?.length || 0
    const totalRooms = themes?.reduce((sum, theme) => sum + (theme.count || 0), 0) || 0

    return {
      title: `Escape Room Themes | Escape Rooms Finder`,
      description: `Explore different escape room themes and categories nationwide. From horror and mystery to adventure and sci-fi, find the perfect themed escape room experience for your group.`,
      keywords: [
        'escape room themes',
        'themed escape rooms',
        'horror escape rooms',
        'mystery escape rooms',
        'adventure escape rooms',
        'sci-fi escape rooms',
        'fantasy escape rooms',
        'escape room categories',
        'escape room finder',
        'themed adventures'
      ],
      authors: [{ name: 'Escape Rooms Finder' }],
      creator: 'Escape Rooms Finder',
      publisher: 'Escape Rooms Finder',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: `Escape Room Themes | Find ${totalRooms}+ Themed Escape Rooms`,
        description: `Explore ${themeCount} different escape room themes with ${totalRooms}+ rooms nationwide. Find your perfect themed adventure.`,
        url: 'https://escaperoomsfinder.com/themes',
        siteName: 'Escape Rooms Finder',
        images: [
          {
            url: 'https://escaperoomsfinder.com/images/adventure escape rooms.jpeg',
            width: 1200,
            height: 630,
            alt: 'Escape Room Themes - Adventure, Horror, Mystery & More',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Escape Room Themes | Find ${totalRooms}+ Themed Escape Rooms`,
        description: `Explore ${themeCount} different escape room themes with ${totalRooms}+ rooms nationwide. Find your perfect themed adventure.`,
        images: ['https://escaperoomsfinder.com/images/adventure escape rooms.jpeg'],
        creator: '@EscapeRoomsFinder',
        site: '@EscapeRoomsFinder',
      },
      alternates: {
        canonical: 'https://escaperoomsfinder.com/themes',
      },
    }
  } catch (error) {
    console.error('Error generating themes metadata:', error)
    return {
      title: 'Escape Room Themes | Escape Rooms Finder',
      description: 'Explore different escape room themes and find the perfect adventure for your group.',
    }
  }
}

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}