# Fracture Framework

TODO: Need way more detail in readme.

## Installation 

JSII Has (too many limitations)[https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/]. This is a sort of janky way to get setup but for now it works for now.

```
npx projen new typescript && \
rm -rf ./node_modules && \
rm yarn.lock && \
pnpm i && \
pnpm add -D @sumoc/fracture && \
curl https://raw.githubusercontent.com/sumoinc/fracture/main/templates/.projenrc.ts -o .projenrc.ts && \
pnpm run default
```


