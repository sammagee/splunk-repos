export interface IRepo {
  id: number
  name: string
  stars: number
  contributors: number
  latest_contributor: number | null
}

class Repo implements IRepo {
  id: number
  name: string
  stars: number
  contributors: number
  latest_contributor: number | null

  constructor(
    id: number,
    name: string,
    stars: number,
    contributors: number,
    latest_contributor: number | null
  ) {
    this.id = id
    this.name = name
    this.stars = stars
    this.contributors = contributors
    this.latest_contributor = latest_contributor
  }
}

export default Repo
