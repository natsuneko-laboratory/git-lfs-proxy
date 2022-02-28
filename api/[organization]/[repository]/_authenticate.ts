import { Octokit } from "@octokit/rest";

const hasRepositoryAccess = async (
  organization: string,
  repository: string,
  _username: string,
  password: string,
  permissions: string[]
) => {
  try {
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
  } catch (err: unknown) {
    return false;
  }
};

// eslint-disable-next-line import/prefer-default-export
export { hasRepositoryAccess };
