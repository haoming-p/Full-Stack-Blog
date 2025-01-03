import { getBlogs } from "@/services/apiBlog";
import BlogContainer from "@/ui_components/BlogContainer";
import Header from "@/ui_components/Header";
import { useQuery } from "@tanstack/react-query";
import PagePagination from "../ui_components/PagePagination";
import { useState } from "react";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const numOfBlogsPerPage = 6;

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["blogs", page],
    queryFn: () => getBlogs(page),
    keepPreviousData: true,
  });

  const blogs = data?.results || [];
  const numOfPages = Math.ceil(data?.count / numOfBlogsPerPage);
  console.log("API Response:", data);
  console.log(numOfPages);

  function handleSetPage(val) {
    setPage(val);
  }
  function increasePageValue() {
    setPage((curr) => curr + 1);
  }
  function decreasePageValue() {
    setPage((curr) => (curr > 1 ? curr - 1 : 1));
  }
  return (
    <>
      <Header />
      <BlogContainer isPending={isPending} blogs={blogs} />
      <PagePagination
        increasePageValue={increasePageValue}
        decreasePageValue={decreasePageValue}
        page={page}
        numOfPages={numOfPages}
        handleSetPage={handleSetPage}
      />
      {isError && <p>Error: {error.message}</p>}
    </>
  );
};

export default HomePage;
