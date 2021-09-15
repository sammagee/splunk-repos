import Head from 'next/head'
import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import Card from '../components/Card'
import Dropdown from '../components/Dropdown'
import Page from '../components/Page'
import { Sort } from '../lib/Sort'

const TITLE = 'Splunk Repos'
const PER_PAGE = 20
const SORT_OPTIONS = [
  { label: 'Last Updated', value: Sort.Latest },
  { label: 'Stars', value: Sort.Stars },
  { label: 'Contributors', value: Sort.Contributors },
]

export interface IPagesContext {
  total: number
  setTotal: Dispatch<SetStateAction<number>>
}

export const PagesContext = createContext<IPagesContext>({
  total: 0,
  setTotal: (total) => {
    throw new Error('Unimplemented.')
  },
})

const Home: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState<Sort>(Sort.Latest)
  const [total, setTotal] = useState<number>(0)

  const pages = []
  for (let i = 0; i < page; i++) {
    pages.push(
      <Page
        index={i}
        key={i}
        sort={sort}
        perPage={PER_PAGE}
        setLoading={i === 0 ? setLoading : undefined}
      />
    )
  }

  const fetchMore = (event: any) => {
    event.preventDefault()

    setPage((prevPage) => prevPage + 1)
  }

  useEffect(() => setPage(1), [sort])

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <main className="w-screen min-h-screen flex sm:items-center justify-center p-4 ">
        <div className="w-full max-w-xl">
          <Card
            title={TITLE}
            actions={
              <div className="flex justify-end">
                <Dropdown
                  label="Sort"
                  options={SORT_OPTIONS}
                  value={sort}
                  setValue={setSort}
                />
              </div>
            }
            footer={
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {page} &middot; Showing{' '}
                  {page * PER_PAGE > total ? total : page * PER_PAGE} of {total}
                </p>

                {total > page * PER_PAGE && (
                  <a
                    className="inline-flex items-center space-x-1 hover:underline text-blue-600 text-sm"
                    href="#"
                    onClick={fetchMore}
                  >
                    <span>More</span>

                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </a>
                )}
              </div>
            }
          >
            <PagesContext.Provider value={{ total, setTotal }}>
              {pages}

              {loading && (
                <div className="flex items-center justify-center p-6">
                  <svg
                    className="flex-shrink-0 animate-spin text-gray-500 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}
            </PagesContext.Provider>
          </Card>
        </div>
      </main>
    </>
  )
}

export default Home
