import Badge from "./Badge";
import CardFooter from "./CardFooter";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/api";
import PropTypes from "prop-types";

const BlogCard = ({blog}) => {
  console.log("Image URL:", `${BASE_URL}${blog.featured_image}`);
  console.log("Image URL try", `${BASE_URL.replace(/\/$/, "")}${blog.featured_image}`)
  console.log("BASE_URL:", BASE_URL);
  console.log("Featured Image Path:", blog.featured_image);   
  
  return (
    <div className="px-3 py-3 rounded-md w-[300px] h-auto flex flex-col gap-4 dark:border-gray-800 border shadow-lg">
      <div className="w-full h-[200px] border rounded-md overflow-hidden">
        <img
          src={`${BASE_URL.replace(/\/$/, "")}${blog.featured_image}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <Badge blog = {blog} />

      <Link to={`blogs/${blog.slug}`}>
        <h3 className="font-semibold  leading-normal text-[#181A2A] mb-0 dark:text-white">
          {blog.title}
        </h3>
      </Link>

      <CardFooter blog = {blog}/>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired, 
    featured_image: PropTypes.string, 
    title: PropTypes.string, 
    category: PropTypes.string, 
  }),
};

export default BlogCard;