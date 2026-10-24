import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto w-full max-w-lg md:max-w-none">
      <Header title={title} />
      <main className="px-4 py-4 md:px-0 md:py-0">
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center md:p-16">
            <p className="text-4xl md:text-5xl">🚧</p>
            <p className="mt-4 font-semibold text-lg">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
