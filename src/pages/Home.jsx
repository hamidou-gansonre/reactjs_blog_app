import React, { useEffect, useState } from 'react'
import service from '../appwrite/appWriteConfig';
import Container from "../components/containers/container";
import PostForm from "../components/post-form/PostForm"
import PostCard from "../components/PostCard"

function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    service.getPosts([]).then((posts) => {
      if(posts){
        setPosts(posts.documents);
      }
    })
  }, []);

  // if(posts.length === 0){
  //   return (
  //     <div className="w-full py-8" >
  //     <Container>
  //       <div className="flex flex-wrap">
  //         <h1>Login to read posts</h1>
  //       </div>
  //     </Container>
  //   </div>
  //   )
  //}
  return (
    <div className="w-full py-8" >
      <Container>
        <div className="flex flex-wrap">
          {
            posts.map((post) => (
              <div key={post.$id} className="w-1/4 p-2">
                <PostCard {...post} />
              </div>
            ))
          }
        </div>
      </Container>
    </div>
  )
}

export default Home