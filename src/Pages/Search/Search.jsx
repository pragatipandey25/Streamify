import { useParams } from "react-router-dom";
import "./Search.css";
import Feed from "../../Components/Feed/Feed";
import Sidebar from "../../Components/Sidebar/Sidebar";

const Search = ({ sidebar }) => {
  const { query } = useParams();
  const decodedQuery = query ? decodeURIComponent(query) : "";

  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className={`container search-container ${sidebar ? "" : "large-container"}`}>
        <div className="search-header">
          <h2>
            Search results for: <span>&ldquo;{decodedQuery}&rdquo;</span>
          </h2>
        </div>
        <Feed category={0} searchQuery={decodedQuery} />
      </div>
    </>
  );
};

export default Search;
