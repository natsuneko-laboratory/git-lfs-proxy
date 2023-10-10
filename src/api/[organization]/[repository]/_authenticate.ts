import { createTokenAuth } from "@octokit/auth-token";
import { Octokit } from "@octokit/rest";

const authByClientToken = async (
  organization: string,
  repository: string,
  password: string,
  permissions: string[]
) => {
  const octokit = new Octokit({ auth: password });
  const repo = await octokit.repos.get({
    owner: organization,
    repo: repository,
  });

  if (permissions.includes("pull"))
    if (!repo.data.permissions?.pull) return false;
  if (permissions.includes("push"))
    if (!repo.data.permissions?.push) return false;

  return true;
};

// installation token(s) are not respond `permissions` in repository metadata, but readable.
const authByServerToken = async (
  organization: string,
  repository: string,
  password: string,
  permissions: string[]
) => {
  const octokit = new Octokit({ auth: password });
  await octokit.repos.get({
    owner: organization,
    repo: repository,
  });

  if (permissions.includes("push")) return false;

  return true;
};

const hasRepositoryAccess = async (
  organization: string,
  repository: string,
  _username: string,
  password: string,
  permissions: string[]
) => {
  try {
    const auth = createTokenAuth(password);
    const { tokenType } = await auth();

    switch (tokenType) {
      case "oauth":
        return await authByClientToken(
          organization,
          repository,
          password,
          permissions
        );

      case "app":
      case "installation":
      case "user-to-server":
        return await authByServerToken(
          organization,
          repository,
          password,
          permissions
        );

      default:
        return false;
    }
  } catch (err: unknown) {
    return false;
  }
};

// eslint-disable-next-line import/prefer-default-export
export { hasRepositoryAccess };
