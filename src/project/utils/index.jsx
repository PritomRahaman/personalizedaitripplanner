export function createPageUrl(fullPath) {
  const [page, query] = fullPath.split("?");
  console.log(page,query)
  return query
    ? `/${page.toLowerCase()}?${query}`
    : `/${page.toLowerCase()}`;
}
