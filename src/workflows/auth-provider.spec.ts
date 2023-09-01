import { NodeProject } from "projen/lib/javascript";
import { AuthProvider, AuthProviderType } from "./auth-provider";
import { AwsEnvironment } from "../environments";

describe("success conditions", () => {
  test("Smoke test OIDC", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.AWS_GITHUB_OIDC,
      awsCredentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    expect(authProvider).toBeTruthy();
  });

  test.skip("Smoke test Key Pair", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.AWS_ACCESS_AND_SECRET_KEY_PAIR,
      awsCredentialsSecretKeyPair: {
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
    const usEast = new AwsEnvironment(project, {
      name: "us-east",
      accountNumber: "0000000000",
    });
    const authProvider = AuthProvider.fromAwsEnvironment(project, usEast);
    expect(authProvider).toBeTruthy();
  });
});
