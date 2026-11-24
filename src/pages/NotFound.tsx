import { NOT_FOUND } from '../content'
import { ButtonLink } from '../components/Button'
import { PageHeader } from '../components/Display'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFound() {
  useDocumentTitle(NOT_FOUND.title)
  return (
    <div className="pb-10 md:pt-10">
      <PageHeader title={NOT_FOUND.title} aside={NOT_FOUND.aside} intro={NOT_FOUND.body}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" arrow size="lg">
            {NOT_FOUND.home}
          </ButtonLink>
          <ButtonLink to="/menu" variant="secondary" size="lg">
            {NOT_FOUND.menu}
          </ButtonLink>
        </div>
      </PageHeader>
    </div>
  )
}
