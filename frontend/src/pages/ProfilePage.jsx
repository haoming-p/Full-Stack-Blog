import { getUserInfo } from "@/services/apiBlog";
import BlogContainer from "@/ui_components/BlogContainer";
import Hero from "@/ui_components/Hero";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Spinner from "@/ui_components/Spinner";
import Modal from "@/ui_components/Modal";
import SignUpPage from "./SignUpPage";
import { useState } from "react";

const ProfilePage = ({ authUsername }) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () =>{
    setShowModal(curr=>!curr)
  }

  const { username } = useParams();

  const { isPending, isError, data } = useQuery({
    queryKey: ["users", username],
    queryFn: () => getUserInfo(username),
  });

  if (isPending) {
    return <Spinner />;
  }
  if (isError) {
    return <p>Error fetching user information.</p>;
  }
  console.log(data);

  const blogs = data?.author_posts;

  return (
    <>
      <Hero userInfo={data} authUsername={authUsername} toggleModal={toggleModal}/>
      <BlogContainer blogs={blogs} title={`🍔 ${username}'s Posts`} />
      {showModal && (
        <Modal toggleModal={toggleModal}>
          <SignUpPage userInfo={data} updateForm={true} toggleModal={toggleModal}/>
        </Modal>
      )}
    </>
  );
};

export default ProfilePage;
