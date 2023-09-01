import { NodeProject } from "projen/lib/javascript";
import { AuthProvider, AuthProviderType } from "./auth-provider";
import { Environment } from "../environments";

describe("success conditions", () => {
  test("Smoke test OIDC", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.GITHUB_OIDC,
      credentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    expect(authProvider).toBeTruthy();
  });

  test("Smoke test Key Pair", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.ACCESS_AND_SECRET_KEY_PAIR,
      credentialsSecretKeyPair: {
        secretAccessKeySecret: "foo",
        accessKeyIdSecret: "bar",
      },
    });
    expect(authProvider).toBeTruthy();
  });

  test("From Environment", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const usEast = new Environment(project, {
      name: "us-east",
      accountNumber: "0000000000",
    });
    const authProvider = AuthProvider.fromEnvironment(project, usEast);
    expect(authProvider).toBeTruthy();
  });
});
