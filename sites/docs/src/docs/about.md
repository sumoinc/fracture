# What is Fracture?

The Fracture Framework is build on top of [projen](https://projen.io/) that adds monorepo capabilities along with some specific project subtypes such as Static Websites and CDK based AWS Services. It also adds to Projen's existing GitHub workflow model for more elaborate deployment and testing workflows, including the capability to conduct deployments to services outside of AWS such as Netlify.

If fact the docs you are reading right now are built and maintained by Fracture!

## Static Site Example

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Vitepress**


```js{5}
// root monorepo project
const project = new TypeScriptProject({
  name: "my-project",
  defaultReleaseBranch: "main",
});

// build out documentation site
const site = new VitePressSite(project, {
  name: "docs",
});

/*******************************************************************************
 * NETLIFY DEPLOYMENT TARGET
 ******************************************************************************/
const netlifyTarget = new NetlifyEnvironment(project, {
  name: "netlify",
  siteId: "e69db060-d613-414c-9964-4a5a5e0e32ea",
});

// deployment target for docs
site.deploy({
  branchPrefix: "feature",
  environment: netlifyTarget,
});
```


**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
