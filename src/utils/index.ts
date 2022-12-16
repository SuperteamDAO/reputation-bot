export const findTopOccurrences = (array: Array<Object>) => {
  const counts: {
    [key: string]: number;
  } = {};
  array.forEach((element) => {
    const key = JSON.stringify(element);
    counts[key] = (+counts[key] || 0) + 1;
  });

  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sortedCounts
    .slice(0, 3)
    .map(([key, count]) => ({ element: JSON.parse(key), count }));
};

export const getTopCommittersMessage = (
  commits: Array<{
    element: any;
    count: number;
  }>
) => {
  if (commits.length === 0) {
    return "*awkward silence*";
  } else {
    return commits.map((committer, index) => {
      return `\n${index + 1}. [${committer.element.commit.author.name}](${
        committer.element.author.html_url
      }) - ${committer.count}`;
    });
  }
};

export function getLatestIssuesMessage(issues: Array<any>) {
  if (issues.length === 0) {
    return "*awkward silence*";
  } else {
    return issues.reverse().map((issue, index) => {
      return `\n${index + 1}. ${issue.title} - ${issue.html_url}`;
    });
  }
}
