import { CommonProject } from "@sumoc/fracture";

const authorName = "Full Name";
const authorAddress = "email@yourdomain.com";
const repository = "https://github.com/your-org/your-repo-name";

const project = new CommonProject({
  name: "your-project-name",
  repository,
  authorName,
  authorOrganization: true,
  authorEmail: authorAddress,

  // deps
  devDeps: ["@sumoc/fracture"],
});

// generate
project.synth();
