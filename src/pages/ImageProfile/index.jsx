var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { Button } from "@mui/material";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OtherUpdated } from "Redux/AgentAdmin";
const App = () => {
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = (file) =>
    __awaiter(void 0, void 0, void 0, function* () {
      let src = file.url;
      if (!src) {
        src = yield new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow === null || imgWindow === void 0
        ? void 0
        : imgWindow.document.write(image.outerHTML);
    });
  console.log(fileList);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const saveImage = () => {
    dispatch(
      OtherUpdated({
        idAgent: user?._id,
        data: { filename: fileList[0].thumbUrl },
        unset: {},
      })
    );
  };
  return (
    <>
      {" "}
      <ImgCrop rotationSlider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
        >
          {fileList.length < 1 && "+ Upload"}
        </Upload>
      </ImgCrop>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "10px" }}
        onClick={() => saveImage()}
      >
        Save
      </Button>
    </>
  );
};
export default App;
