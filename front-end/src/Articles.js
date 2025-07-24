export function Articles(params) {
  if (!params.currentUser) {
    // User is not logged in, do not show any articles
    return null; // or you could return a message like <div>Please log in to see articles.</div>
  }

  //const articles = params.data.articles ? params.data.articles : [];
  //const queryName = params.query.queryName ? params.query.queryName : "na";
  let articleCount = (params.data.totalResults)?params.data.totalResults:0;
  //const articleCount = params.data.totalResults ? params.data.totalResults : 0;
  console.log(articleCount);

  let articles = params.data.articles ? params.data.articles : [];

  return (
    <div>
      <ol>
        {articles.map((item, idx) => {
          if (item) {
            if (item.title) {
              if (item.title === "[Removed]") {
                return <li key={idx}>Was Removed</li>;
              }
              let trimTitle = item.title.substring(0, 200);
              return (
                <li key={idx}>
                  {trimTitle}
                  <a href={item.url} target="_blank" rel="noreferrer">
                    &nbsp;Link
                  </a>
                </li>
              );
            } else {
              return <li key={idx}>No Title</li>;
            }
          } else {
            return <li key={idx}>No Item</li>;
          }
        })}
      </ol>
    </div>
  );
}
