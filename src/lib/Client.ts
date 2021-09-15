import { Octokit } from '@octokit/rest'
import fs from 'fs/promises'
import path from 'path'
import Repo, { IRepo } from './Repo'
import { Sort } from './Sort'

const CACHE_PATH = path.resolve('./public/data', 'cache.json')

export interface IRepoResultSet {
  repos?: IRepo[]
  total: number
}

export interface IClient {
  octokit: Octokit
  org: string
  per_page: number
  sort: Sort
  getCache: (page: number) => Promise<IRepoResultSet>
  getSortedRepos: (repos: IRepo[]) => IRepo[]
  fetchRepos: (page: number) => Promise<IRepoResultSet>
  formatRepos: (repos: any) => Promise<IRepo[]>
  fetchRepoContributorCount: (repo: string) => Promise<number>
  fetchRepoLatestContributorId: (repo: string) => Promise<number | null>
  setSort: (sort: Sort) => IClient
}

class Client implements IClient {
  octokit: Octokit
  org: string
  per_page: number
  sort: Sort

  constructor(org: string, per_page: number) {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })
    this.org = org
    this.per_page = per_page
    this.sort = Sort.Latest
  }

  async getCache(page: number): Promise<IRepoResultSet> {
    const cached_contents =
      (await fs.readFile(CACHE_PATH)).toString() || JSON.stringify([])
    const cached_json = JSON.parse(cached_contents)
    const cached_repos = cached_contents.length
      ? this.getSortedRepos(cached_json).slice(
          (page - 1) * this.per_page,
          page * this.per_page
        )
      : []

    return { repos: cached_repos, total: cached_json.length }
  }

  // Trivial to add sort direction from here
  getSortedRepos(repos: IRepo[]): IRepo[] {
    if (this.sort === Sort.Stars)
      return repos.sort((a: IRepo, b: IRepo) => b.stars - a.stars)

    if (this.sort === Sort.Contributors)
      return repos.sort((a: IRepo, b: IRepo) => b.contributors - a.contributors)

    return repos
  }

  async fetchRepos(page: number): Promise<IRepoResultSet> {
    console.log(await this.octokit.rateLimit.get())

    return []

    const cache = await this.getCache(page)

    if (cache.repos?.length && cache.total > 0) return cache

    let fetchedRepos

    try {
      fetchedRepos = await this.octokit.paginate('GET /orgs/{org}/repos', {
        org: this.org,
        type: 'public',
        per_page: 100,
        sort: 'updated',
      })
    } catch (err) {
      console.error(err)
    }

    const repos = await this.formatRepos(fetchedRepos)

    await fs.writeFile(CACHE_PATH, JSON.stringify(repos))

    return {
      repos: this.getSortedRepos(repos).slice(
        (page - 1) * this.per_page,
        page * this.per_page
      ),
      total: repos.length,
    }
  }

  async formatRepos(repos: any): Promise<IRepo[]> {
    return await Promise.all(
      repos.map(
        async (repo: any) =>
          new Repo(
            repo.id,
            repo.name,
            repo.stargazers_count,
            await this.fetchRepoContributorCount(repo.name),
            await this.fetchRepoLatestContributorId(repo.name)
          )
      )
    )
  }

  async fetchRepoContributorCount(repo: string): Promise<number> {
    try {
      const { data: contributors } =
        await this.octokit.rest.repos.listContributors({
          owner: this.org,
          repo,
        })

      return contributors && contributors.length > 0 ? contributors.length : 0
    } catch (err) {
      console.error(err)
    }

    return 0
  }

  async fetchRepoLatestContributorId(repo: string): Promise<number | null> {
    try {
      const { data: commit } = await this.octokit.rest.repos.listCommits({
        owner: this.org,
        repo,
        per_page: 1,
        page: 1,
      })

      console.log(commit)

      return null
      // return data?.commit?.[0]?.author?.id || null
    } catch (err) {
      console.error(err)
    }

    return null
  }

  setSort(sort: Sort): IClient {
    this.sort = sort

    return this
  }
}

export default Client
