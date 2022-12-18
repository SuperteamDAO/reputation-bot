import _ from "lodash";

export const getUniqueElements = (
  array: Array<{
    element: any;
    count: number;
  }>,
  key: string
) => {
  return [...new Map(array.map((item) => [item.element[key], item])).values()];
};

export const findMostOccurrences = (array: Array<Object>) => {
  const counts: {
    [key: string]: number;
  } = {};
  array.forEach((element) => {
    const key = JSON.stringify(element);
    counts[key] = (+counts[key] || 0) + 1;
  });

  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const parsedResult = sortedCounts.map(([key, count]) => ({
    element: JSON.parse(key).author,
    count,
  }));
  return getUniqueElements(parsedResult, "login");
};

export const generateMessageForTopCommitters = (
  commits: Array<{
    element: any;
    count: number;
  }>
) => {
  if (commits.length === 0) {
    return "*awkward silence*";
  } else {
    return commits.map((committer, index) => {
      const username = committer.element.login;
      const url = `https://github.com/${username}`;
      return `\n${index + 1}. [${username}](${url}) - ${committer.count}`;
    });
  }
};

export const generateMessageForLatestIssues = (issues: Array<any>) => {
  if (issues.length === 0) {
    return "*awkward silence*";
  } else {
    return issues.reverse().map((issue, index) => {
      return `\n${index + 1}. ${issue.title} - ${issue.html_url}`;
    });
  }
};
