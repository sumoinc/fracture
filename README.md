# Fracture Framework

The Fracture Framework automates the generation and configuration of AWS services 
based on code. 

Services as Code? 

Aren't services usually already code?

This definition need some work.

## Nomenclature / Smithy and CDK

This framework borrows some of it's nomenclature from OO, the [Smithy Project at AWS](https://smithy.io/2.0) and the CDK.

- A Resource is one entity or thing to be represented by a model.
- Each Resource has many Attributes to describe it.
- Services are a collection of Resources plus their behaviors, this is the smallest deployable unit in the framework. These don't include any UI, only APIs.
- Apps are stand along websites, web apps, or other "stuff" that is user facing.

Each fracture app is a monorepo containing three primary workspaces

1. Services (/services) - Each represents one api opr "service" in a traditional sense. UI is not meant to live here. Developers are meant to add and edit code here easily.
1. Apps (/apps) - Each web facing UI. UI is means to live here. Developers are meant to add and edit code here easily.

## Setting up Fracture

Give it a name, that's it!

```
const fracture = new Fracture({
  name: "my-app",
});
```

## Describe Organization, Accounts, & Environments

You describe the accounts and regions that will be deployed into as environments

```
const org = fracture.addOrganization({ id: "org-123456" });
const devAccount = org.addAccount({ id: "0000000000", name: "dev" });
// const stagingAccount = org.addAccount({ id: "1111111111", name: "stage" });
// const prodAccount = org.addAccount({ id: "2222222222", name: "prod" });

const usEastDev = fracture.addEnvironment({
  account: devAccount,
  region: REGION_IDENTITIER.US_EAST_1,
});

const usWestDev = fracture.addEnvironment({
  account: devAccount,
  region: REGION_IDENTITIER.US_WEST_1,
});
```

## Create Services

Each service is, more or less, a bounded context. Each service is turned into a 
package in the generated Fracture monorepo.

```
const userService = fracture.addService({ name: "user" });
const companyService = fracture.addService({ name: "company" });
```

## Create Resources w/Attributes

Each resources is an entity or composite type definition.

```
const user = userService.addResource({ name: "user" });
user.addResourceAttribute({
  name: "first-name",
  shortName: "fn",
  isRequired: true,
});
user.addResourceAttribute({
  name: "last-name",
  shortName: "ln",
  isRequired: true,
});

const company = companyService.addResource({ name: "company" });
company.addResourceAttribute({
  name: "name",
  shortName: "nm",
  isRequired: true,
});
```