/* eslint-disable no-unused-vars */
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import service from "../../appwrite/appWriteConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
        //featuredImage: post?.featuredImage || "",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    if(post){
        const file = data.image[0] ?
        await service.uploadFile(data.image[0]) : null;

        if(file){
            await service.deleteFile(post.featuredImage);
        }

        const dbPost = await service.updatePost(post.$id,{
            ...data,
            featuredImage: file ? file.$id : undefined,
        }) ;

        if(dbPost){
            navigate(`/post/${dbPost.$id}`);
        }

    
    } else {
        const file = await service.uploadFile(data.image[0]);
        if(file){
            const fileId = file.$id;
            data.featuredImage = fileId;
            const dbPost = await service.createPost({
                ...data,
                userId: userData.$id,
            });

            if(dbPost){
                navigate(`/post/${dbPost.$id}`);
            }
        }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
  }, []);

  React.useEffect(() => {
    watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
  }, [watch, slugTransform, setValue]);

  return (
    <form className="flex flex-wrap" onSubmit={handleSubmit(submit)}>
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          name="title"
          className="mb-4"
          {...register("title", { required: true })}
          placeholder="Enter title"
        />
        <Input
          label="Slug"
          name="slug"
          className="mb-4"
          placeholder="Slug"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.target.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label={"Content: "}
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/webp"
          {...register("image", { required: !post })}
        />
      </div>
      {post && (
        <div className="w-full mb-4">
          <img
            src={service.getFileView(post.featuredImage)}
            alt={post.title}
            className="rounded-lg"
          />
        </div>
      )}
      <Select
        label="Status"
        name="status"
        {...register("status", { required: true })}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "draft", label: "Draft" },
        ]}
      />
      <Button
        bgColor={post ? "bg-green-500" : undefined}
        type="submit"
        className="w-full my-3 rounded-lg"
      >
        {post ? "Update" : "Create"} Post
      </Button>
    </form>
  );
}
