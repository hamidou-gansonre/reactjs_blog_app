import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import service from "../appwrite/appWriteConfig";
import Button from "../components/Button";
import Container from "../components/containers/Container";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
  //initial post state
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData && post.userId === userData.$id;

  useEffect(() => {
    if (slug) {
      service.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
        } else {
          navigate("/");
        }
      });
    }
  }, [slug, navigate]);

  //delete post function
  const deletePost = async () => {
    await service.deletePost(post.$id).then((status) => {
      if (status) {
        service.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };
  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full fex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={service.getFileView(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
          />
          {isAuthor && (
            <div className="absolute-right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500 " className="mr-3 rounded">
                  Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500 "
                onClick={deletePost}
                className="rounded"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="browser-css">{parse(post.content)}</div>
        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
