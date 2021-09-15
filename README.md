# Splunk Repos

## Notes

**UI**

In order to better show the functionality of this code, I have implemented a simple UI that shows the required data, and allows for pagination and sorting.

**Caching**

You will notice that the first load may take a while. This is because, unfortunately, GitHub's API does not currently allow for sorting and showing some of the required fields on a Repository object. There is also a fairly strict Rate Limiting policy in place on the GitHub API, so the many requests that are required for this project to function will all requirements, may only be able to load a couple of times before being rate limited.

Because of these reasons, I have decided to implement a caching technique that allows me to fetch all of the repositories and their required relationship data, and place them into a cache. This cache is populated in `/public/data/cache.json`.

**Important Files**

Because I decided to add a UI to this project, and have used Next.js as a framework, there are quite a few files that are not as important as others. Below is a list of these important files in the project:

- `/public/data/cache.json` - this is the cache that is populated after the first request. It allows for speedier following requests.
- `/src/components/Page.tsx` - this is a page component that lists each of the repos on a given page. It is responsible for fetching the data from the API I have created.
- `/src/lib/Client.ts` - this is the main driver that fetches, sorts, paginates, and caches all of the data. If the data is cached, it uses that; if not, it fetches the data from GitHub and puts it in the cache.
- `/src/lib/Repo.ts` - this is a simple model for a Repository, which sets up the shape based on the assignment's required fields.
- `/src/pages/api/repos.ts` - this is an API Route, which instantiates a `Client` and compiles the required data.

**Usage**

If you were to download and run this project locally, you would want to make the following considerations, and follow the steps.

You will need to first ensure that you create a `/.env` file and place the following in it, replacing the token with one that you [generate from here](https://github.com/settings/tokens):

```
GITHUB_ACCESS_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

1. Run `yarn; yarn dev` to start the development server
2. Open [`localhost:3000`](http://localhost:3000) in your browser

## Instructions

As a data-to-everything platform, Splunk helps users make insightful
decisions about every aspect of their business with the power of data.

As part of the Cloud Platform UI experience team, you are assigned to write
software to help better understand Splunk’s public Github repositories.

The end goal is to create a web application that contains an data API /
client service layer and UI rendering layer.

This take home exercise ONLY focuses on the data API layer and has the
following requirements:

As a user of your software, I want to be able to get a list of all public
Splunk repos (with pagination support) sorted by: - last updated time - number of stars - number of contributors

The output list of repos should contain below properties only:

- id
- name
- number of stars
- number of contributors
- the ID of the person who committed last

You may find these documentation helpful: - https://docs.github.com/en/rest/reference/repos#list-organization-repositories - https://docs.github.com/en/rest/reference/repos#list-commits - https://docs.github.com/en/rest/guides/traversing-with-pagination

### Requirements:

1.  Code skeleton below is for illustration purposes. Feel free to modify or
    define your own functions if needed.
2.  Pagination support IS required.
3.  Feel free to use any 3rd party libraries and tools.
4.  No UI needs to be built. Your code should output three lists which implement
    the different sort requirements to the console (click Console on the right bottom)
5.  Feel free to refer to the Github API (https://docs.github.com/en/rest)
    doc at any time.

### Submission Instructions:

1.  Make sure your code compiles and runs as expected.
2.  Save your code changes (File -> Save or Command + S on Mac). This will
    automatically generate a forked Codesandbox link (no account needed)
3.  Complete Submission Form (https://forms.gle/TNNWXJdRoyNwX7cx6) within 3
    days of receiving this link.

Happy coding and we are looking forward to meeting you.
