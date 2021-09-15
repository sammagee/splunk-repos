import type { NextApiRequest, NextApiResponse } from 'next'
import Client from '../../lib/Client'
import { IRepo } from '../../lib/Repo'
import { Sort } from '../../lib/Sort'

interface IReposResponse {
  repos: IRepo[]
  repos_by_latest: IRepo[]
  repos_by_stars: IRepo[]
  repos_by_contributors: IRepo[]
  total: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IReposResponse>
) {
  const { org, page, per_page, sort } = req.query
  const client = new Client(org as string, parseInt(per_page as string))
  const data = await client
    .setSort(sort as Sort)
    .fetchRepos(parseInt(page as string))
  const repos_by_latest = (
    await client.setSort(Sort.Latest).fetchRepos(parseInt(page as string))
  ).repos
  const repos_by_stars = (
    await client.setSort(Sort.Stars).fetchRepos(parseInt(page as string))
  ).repos
  const repos_by_contributors = (
    await client.setSort(Sort.Contributors).fetchRepos(parseInt(page as string))
  ).repos

  return res.status(200).json({
    repos: data.repos || [],
    repos_by_latest: repos_by_latest || [],
    repos_by_stars: repos_by_stars || [],
    repos_by_contributors: repos_by_contributors || [],
    total: data.total,
  })
}
