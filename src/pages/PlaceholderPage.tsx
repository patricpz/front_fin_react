import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-lg">
      <Header title={title} />
      <main className="px-4 py-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-4xl">🚧</p>
            <p className="mt-4 font-medium">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
