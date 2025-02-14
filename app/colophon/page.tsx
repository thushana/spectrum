import { execSync } from 'child_process';

import GitHubIcon from '@mui/icons-material/GitHub';
import CloudIcon from '@mui/icons-material/Cloud';

function getGitInfo() {
  try {
    // Check if running on Vercel
    if (process.env.VERCEL) {
      return {
        git: {
          commitHash: process.env.VERCEL_GIT_COMMIT_SHA || 'Unknown',
          branch: process.env.VERCEL_GIT_COMMIT_REF || 'Unknown',
          gitProvider: process.env.VERCEL_GIT_PROVIDER || 'Unknown',
          gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'Unknown',
          gitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || 'Unknown',
        },
        vercel: {
          status: 'Running on Vercel',
          environment: process.env.VERCEL_ENV || 'Unknown',
          deploymentUrl: process.env.VERCEL_URL || 'Unknown',
          branchUrl: process.env.VERCEL_BRANCH_URL || 'Unknown',
          productionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL || 'Unknown',
          region: process.env.VERCEL_REGION || 'Unknown',
          deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'Unknown',
          projectId: process.env.VERCEL_PROJECT_ID || 'Unknown',
        },
      };
    }

    // If local, fetch git information
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    const statusOutput = execSync('git status --short').toString().trim();
    const isDirty = statusOutput.length > 0;

    const aheadBehindOutput = execSync(
      'git rev-list --count --left-right origin/main...HEAD',
      { stdio: 'pipe' },
    )
      .toString()
      .trim();
    const [ahead, behind] = aheadBehindOutput.split('\t').map(Number);

    const lastCommitDate = execSync('git log -1 --format=%cd')
      .toString()
      .trim();

    return {
      git: {
        commitHash,
        branch,
        isDirty,
        ahead: ahead || 0,
        behind: behind || 0,
        lastCommitDate,
        status: isDirty
          ? 'Local (Uncommitted Changes)'
          : ahead > 0
            ? `Local (Ahead by ${ahead})`
            : behind > 0
              ? `Local (Behind by ${behind})`
              : 'Local (Clean)',
      },
      vercel: {
        status: 'Local',
        environment: 'Local',
        deploymentUrl: 'Unavailable',
        branchUrl: 'Unavailable',
        productionUrl: 'Unavailable',
        region: 'Unavailable',
        deploymentId: 'Unavailable',
        projectId: 'Unavailable',
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching git info:', error);
    return {
      git: {
        commitHash: 'Unknown',
        branch: 'Unknown',
        isDirty: false,
        ahead: 0,
        behind: 0,
        lastCommitDate: 'Unknown',
        status: 'Error fetching Git info',
      },
      vercel: {
        status: 'Unknown',
        environment: 'Unknown',
        deploymentUrl: 'Unknown',
        branchUrl: 'Unknown',
        productionUrl: 'Unknown',
        region: 'Unknown',
        deploymentId: 'Unknown',
        projectId: 'Unknown',
      },
    };
  }
}

const Colophon = () => {
  const { git, vercel } = getGitInfo();

  return (
    <div className="font-sans">
      <h1 className="text-4xl font-bold mb-4">Colophon</h1>
      <h2 className="text-xl font-semibold mb-2">
        <GitHubIcon className="mr-2" />
        Git Information
      </h2>
      <table className="table-auto border-collapse w-full">
        <colgroup>
          <col className="w-[20%]" />
          <col />
        </colgroup>
        <tbody>
          {Object.entries(git).map(([key, value]) => (
            <tr key={key} className="border-t border-gray-200">
              <td className="px-4 py-2 font-semibold text-left capitalize whitespace-nowrap">
                {key.replace(/([A-Z])/g, ' $1')}
              </td>
              <td className="px-4 py-2 text-gray-700 truncate">
                {value.toString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-xl font-semibold mt-6 mb-2">
        <CloudIcon className="mr-2" />
        Vercel Information
      </h2>
      <table className="table-auto border-collapse w-full">
        <colgroup>
          <col className="w-[20%]" />
          <col />
        </colgroup>
        <tbody>
          {Object.entries(vercel).map(([key, value]) => (
            <tr key={key} className="border-t border-gray-200">
              <td className="px-4 py-2 font-semibold text-left capitalize whitespace-nowrap">
                {key.replace(/([A-Z])/g, ' $1')}
              </td>
              <td className="px-4 py-2 text-gray-700 truncate">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Colophon;
