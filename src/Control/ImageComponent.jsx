/* eslint-disable react/prop-types */
import { Image, Space } from 'antd';

function ImageComponent({ src, taille }) {
  return (
    <div style={{ marginRight: '5px' }}>
      <Space size={12}>
        <Image width={taille} src={src} placeholder={<Image preview={false} src={src} width={taille} />} />
      </Space>
    </div>
  );
}

export default ImageComponent;
