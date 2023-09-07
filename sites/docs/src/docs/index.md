# What is Fracture?

The Fracture Framework is built on top of [projen](https://projen.io/) that adds monorepo capabilities along with some specific project subtypes such as Static Websites and CDK based AWS Services. It also adds to Projen's existing GitHub workflow model for more elaborate deployment and testing workflows, including the capability to conduct deployments to services outside of AWS such as Netlify.

If fact the docs you are reading right now are built and maintained by Fracture!

## Tooling & Capabilities

Fracture leverages a several specific tools and libraries to accomplish all it does. This means that it expects to operate in a certain environment and for specific use cases. This may change over time but for now, here's a rundown of some capabilities and the toolchain.

### TypeScript Based

The project is built specifically with TypeScript in mind. It's written in TypeScript, the entire monorepo expects configuration to exist for TypeScript, and all subproject types are based on the `TypeScriptProject` types from projen.

It's TypeScript.

### Monorepo Management

Fracture uses a combination of [Turborepo](https://turbo.build/repo/docs) and [PNPM](https://pnpm.io/) for monorepo management. PNPM workspaces are used to manage the subproject locations and Turborepo is used to manage script commands across the entire monorepo.

Running `pnpm run build` at the root hands off subproject build steps to Turborepo to efficiently run across all subprojects.

::: info Potential Future Features
- Add capability to cache build artifacts on S3 using Turborepo.
:::

_Specifying NPM or Yarn as the package manager is not supported and probably won't work._

## CI / Workflow Management

A deployment workflow is managed by Fracture that builds artifacts for all environments and then adds deployment jobs for each target environment on a per branch basis.

You start by adding ennvironment configurations for providers such as AWS and Netlify, then you configure branch specific deployments targeting each. The entire deployment workflow is then generated as a GitHub formatted YAML workflow file. 

**Workflow Example**

For example, this configuration deploys a documentation VitePress site to Netlify each time there is a push to main.

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

You can see a working example of this type of workflow used for the Fracture documentation [at Github here](https://github.com/sumoinc/fracture/blob/main/.github/workflows/deploy.yml)


_Even though projen has support for Gitlab and CircleCI, Frature is specifically designed to be used with GitHub._


## Code Generation

todo