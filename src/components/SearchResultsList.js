import { Link } from "react-router-dom";
import "../css1.css"


export const SearchResultsList = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result) => {
        return <div
        className="search-result"
      >
        <Link to={`/Profile/${result.id}`}>{result.username}</Link>
      </div>
      })}
    </div>
  );
};