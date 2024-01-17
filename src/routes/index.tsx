import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { CommentMainPage } from "@/app/add-comment";
import { CommentFormPage } from "@/app/add-comment/comment-form";
import { CommentUpPage } from "@/app/add-comment/comment-up";
import { Archive } from "@/app/archive";
import { NotFound } from "@/app/error/404";
import { Home } from "@/app/home";
import { OnBoarding } from "@/app/on-boarding";
import { Post } from "@/app/post";
import { Done } from "@/app/post/done";
import { KeyWord } from "@/app/post/keyword";
import { UnpublishedPostPage } from "@/app/unpublished-post";
import { KakaoAuth } from "@/components/app/login/kakao/kakao-auth";
import { GlobalLayout } from "@/components/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/",
        element: <OnBoarding />,
      },
      {
        path: "/main",
        element: <Home />,
      },
      {
        path: "/auth",
        element: <KakaoAuth />,
      },
      {
        path: "/post/write",
        element: <Post />,
      },
      {
        path: "/post/done",
        element: <Done />,
      },
      {
        path: "/post/keyword",
        element: <KeyWord />,
      },
      {
        path: "seal/:id",
        element: <UnpublishedPostPage />,
      },
      {
        path: "clap",
        element: <CommentMainPage />,
      },
      {
        path: "clap/write",
        element: <CommentFormPage />,
      },
      {
        path: "clap/up",
        element: <CommentUpPage />,
      },
      {
        path: "/archive",
        element: <Archive />,
      },
    ],
  },
]);

export const Routers = () => {
  return <RouterProvider router={router} />;
};
