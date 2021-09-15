import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useContext,
  useEffect,
} from 'react'
import useSWR from 'swr'
import { IRepo } from '../lib/Repo'
import { Sort } from '../lib/Sort'
import { IPagesContext, PagesContext } from '../pages'
import fetcher from '../util/fetcher'
import Repo from './Repo'

interface PageProps {
  index: number
  perPage: number
  sort: Sort
  setLoading?: Dispatch<SetStateAction<boolean>>
}

const Page: FunctionComponent<PageProps> = ({
  index,
  perPage,
  sort,
  setLoading,
}) => {
  const { setTotal } = useContext<IPagesContext>(PagesContext)
  const { data } = useSWR(
    `/api/repos?org=splunk&page=${index + 1}&per_page=${perPage}&sort=${sort}`,
    fetcher
  )

  useEffect(() => {
    if (data) {
      setTotal(data.total)

      // Log for Assignment Requirements
      console.log(`By Latest (Page ${index + 1})`)
      console.table(data.repos_by_latest)
      console.log(`By Stars (Page ${index + 1})`)
      console.table(data.repos_by_stars)
      console.log(`By Contributors (Page ${index + 1})`)
      console.table(data.repos_by_contributors)

      if (setLoading) setLoading(false)
    }
  }, [data])

  return (
    (data &&
      data.repos &&
      data.repos.length > 0 &&
      data.repos.map((repo: IRepo) => <Repo key={repo.id} repo={repo} />)) ||
    ''
  )
}

export default Page
