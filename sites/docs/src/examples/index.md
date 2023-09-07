# Fracture Framework Examples

Some basic examples are below. More will be added in future.

## The Root Project

To get started and create the root of the monorepo only take three lines.

```js
const parent = new FractureProject({
  name: "my-project",
});
```

`FractureProject()` extends projen's `TypeScriptProject()`, so any options that you can pass into `TypeScriptProject()` can also be given to `FractureProject()`, with a few exceptions:

1. `defaultReleaseBranch` is optional, defaults to "main".
1. Package Management for the monorepo is done using PNPM 8. You cannot override this.
1. Linting with Prettier is active and cannot be disabled.


## Static Site

Bootstrapping a static site is only a few more lines of code. Here's an example to generate a VitePress based documentation subproject (like this one).

```js
// root monorepo project
const parent = new FractureProject({
  name: "my-project",
});

// build documentation site
const site = new VitePressSite({
  parent,
  name: "docs",
});
```

## Deployment

You can easily configure deployment for your static site wth a few more lines of code. 
The following example deploys the static site to Netlify when a push to the main branch occurs.

```js
// build documentation site
const site = new VitePressSite({
  parent: new FractureProject({
    name: "my-project",
  });
  name: "docs",
});

// deployment target for docs
site.deploy({
  branchPrefix: "main",
  environment: new NetlifyEnvironment(site.parent, {
    name: "netlify",
    siteId: "00000000-1111-2222-3333-444444444444",
  }),
});
```
