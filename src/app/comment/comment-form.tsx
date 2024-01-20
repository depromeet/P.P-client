import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NotFound } from "@/app/error/404";
import CloseSVG from "@/assets/icons/close.svg?react";
import { LayeredBackground } from "@/components/app/comment/layered-background";
import { MessageForm } from "@/components/app/comment/message-form";
import { RequiredForm } from "@/components/app/comment/required-form";
import { BluredAppbar } from "@/components/common/blured-appbar";
import { ButtonProvider } from "@/components/common/button-provider";
import { Header } from "@/components/common/header";
import { ImageCropper } from "@/components/common/image-cropper";
import { DefaultLayout } from "@/components/layout/default";
import { ConfirmModal, MainButton, SubButton } from "@/hooks/modal/modals";
import { useModal } from "@/hooks/modal/useModal";
import useImageCompress from "@/hooks/useImageCompress";

const DUMMY_DATA = {
  id: "1",
  keyword: "센스있는",
  username: "지영",
};

export const CommentFormPage = () => {
  const [nickname, setNickname] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [openCrop, setOpenCrop] = useState(false);
  const { compressImage } = useImageCompress();
  const [required, setRequired] = useState(false);
  const navigate = useNavigate();
  const [render, modal] = useModal();

  useEffect(() => {
    setRequired(nickname.length > 0 && image.length > 0);
  }, [nickname, image]);

  const handleModal = async () => {
    const result = await modal(
      <ConfirmModal
        title="칭찬 반응 작성을 그만둘까요?"
        description="지금 돌아가면 이미지와 텍스트 내용이 삭제돼요"
        buttons={[
          <SubButton
            key="unpublished-post-cancel"
            label="계속 작성"
            value="cancel"
          />,
          <MainButton
            key="unpublished-post-delete"
            label="작성 종료"
            value="confirm"
          />,
        ]}
      />,
    );
    if (result === "cancel") return;
    sessionStorage.removeItem("nickname");
    sessionStorage.removeItem("content");
    sessionStorage.removeItem("imageUrl");
    navigate(-1);
  };

  /** 이미지 변경 이벤트 */
  const changeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      const compressedImage = compressImage(event.target.files[0]);
      compressedImage
        .then((res) => {
          reader.readAsDataURL(res as Blob);
          reader.onload = () => {
            setImage(reader.result as string);
            setOpenCrop(true);
          };
        })
        .catch((error) => {
          console.log(error); // eslint rule
        });
    }
  };

  const saveForm = () => {
    try {
      sessionStorage.setItem("comment_nickname", nickname);
      sessionStorage.setItem("comment_image", image);
      sessionStorage.setItem("comment_message", message);
    } catch (err) {
      return <NotFound />;
    }
    navigate("/clap/up");
  };

  return (
    <DefaultLayout
      appbar={
        <BluredAppbar
          left={<CloseSVG onClick={handleModal} />}
          title="칭찬 반응 남기기"
        />
      }
    >
      {openCrop ? (
        <ImageCropper
          src={image}
          openCrop={setOpenCrop}
          scaleImage={setImage}
        />
      ) : (
        <>
          <LayeredBackground>
            <Header
              text={`{${DUMMY_DATA.keyword}} 순간을 올린\\n {${DUMMY_DATA.username}} 님에게 칭찬 남기기`}
            />

            <div className="flex w-full flex-col gap-7">
              <RequiredForm
                nickname={nickname}
                setNickname={setNickname}
                image={image}
                changeImage={changeImage}
              />
              {required && (
                <MessageForm message={message} setMessage={setMessage} />
              )}
            </div>
          </LayeredBackground>

          <ButtonProvider isFull={true}>
            <ButtonProvider.Primary
              disabled={!required}
              onClick={() => saveForm()}
            >
              칭찬 보내기
            </ButtonProvider.Primary>
          </ButtonProvider>
        </>
      )}
      {render()}
    </DefaultLayout>
  );
};