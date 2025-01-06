import { BASE_URL } from "@/api";
import { FormatDate } from "@/services/formatDate";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CardFooter = ({ blog }) => {
  return (
    <Link to={`/profile/${blog.author.username}`}>
      <div className="flex items-center gap=4 ">
        <span className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={`${BASE_URL}${blog.author.profile_picture}`}
              className="c rounded-full w-full h-full object-cover"
            />
          </div>

          <small className="text-[#97989F] text-[12px] font-semibold">
            {blog.author.first_name}
            {blog.author.last_name}
          </small>
        </span>

        <small className="text-[#97989F] text-[12px] font-semibold ml-3">
          {FormatDate(blog.published_date)}
        </small>
      </div>
    </Link>
  );
};

CardFooter.propTypes = {
  blog: PropTypes.shape({
    author: PropTypes.shape({
      profile_picture: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
    published_date: PropTypes.string,
  }),
};

export default CardFooter;
