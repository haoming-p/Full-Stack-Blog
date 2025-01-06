import BlogCard from "./BlogCard";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

const BlogContainer = ({ isPending, blogs = [], title='🍔 Latest Posts' }) => {
  if (isPending) {
    return <Spinner />;
  }

  return (
    <section className="padding-x py-6  max-container">
      <h2 className="font-semibold text-xl mb-6 dark:text-white text-center">
        {title}
      </h2>

      <div
        className={`${
          blogs.length < 3 ? "flexLeft" : "flexCenter"
        } flex-wrap gap-6`}>
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

BlogContainer.propTypes = {
  isPending: PropTypes.bool,
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      featured_image: PropTypes.string,
      title: PropTypes.string,
      category: PropTypes.string,
    })
  ),
};

export default BlogContainer;
