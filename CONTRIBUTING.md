# Contributing

This project is a gathering of tools, and our goal is to create a [website](https://github.com/inbrowser/inbrowser.github.io) providing a user-friendly interface for them.

* You need to install [Node.js](https://nodejs.org/en/)
* It's recommended to code in [Webstorm](https://www.jetbrains.com/webstorm/).

Once both are installed, run Webstorm

* write `npm i` (or npm install, in a terminal)
* you can run tests with `mocha ./path/to/tests.js` (or `mocha path\\to\\tests.js` on Windows)

As we are using test driven development, this should be the only way to run your code.

<hr>

## General

The code, the comments, the commits, and everything else, must be in **English**.

Use GitHub discussions to talk about something (feature, question, etc.).

* **Versioning**

We will use [Semantic Versioning 2.0.0](https://semver.org/).

> * **Format**: MAJOR.MINOR.PATCH
>     * MAJOR: breaking change (of the API)
>     * MINOR: non-breaking change, backward compatible
>     * PATCH: internal change
> * 0.y.z: in development
> * 1.y.z: stable

<hr>

## Project Structure

Each kind of functionalities is inside a folder in the root folder. We are putting inside each folder, 

* a file `tests.js` with the tests (using [mocha](https://mochajs.org/))
* a file `api.ts` (in [Typescript](https://www.typescriptlang.org/)) with the functions that the website can use

<hr>

## Git Workflow

* **Branches**

Do not push on `main`. Make a branch per version (ex: `version-1.0.0`), and create a new branch for each feature (ex: `add-seo-broken-links`). Make a **pull request** when you need to merge into `version-x.x.x` and when you need to merge in `main`.

Of course, you should ask for at least **one** review.

* **Commits' names**

We are following [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), with these values of "type"

* `docs`: commit related to the documentation
* `tests`: commit related to the tests
* `feat`: adding a feature
* `fix`: fixing something
* `style`: cleaning the code
* `security`: security
* `deps`: upgrading/downgrading dependencies

> Ex: `feat: adding seo-broken-links`<br>