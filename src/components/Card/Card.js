import "./Card.css";
import React, { useState, useCallback, useRef } from "react";
import NoImage from "../../assets/img/no-image.jpg";
import { useDropzone } from "react-dropzone";
import { Modal, Avatar, Input, Icon, Button, notification } from "antd";
import "antd/dist/antd.css";
import { Card } from "antd";
import Base from "antd/lib/typography/Base";
import imagex from "../../assets/img/monkey-avatar.png";
import rgbHex from "rgb-hex";

const Ficha = () => {
  //Declaracion de Hooks y variables globales
  const [avatar, setAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tamaño, setTamaño] = useState(0);
  const [formato, setFormato] = useState("Sin Formato");
  const [resolucion, setResolucion] = useState("Resolución");
  const [cordx, setCordx] = useState(0);
  const [cordy, setCordy] = useState(0);
  const [colorRgb, setColorRgb] = useState(0, 0, 0);
  const [colorHexa, setColorHexa] = useState("#");
  const [imgCanva, setImgCanva] = useState(false);

  const [urlImage, setUrlImg] = useState(null);

  let canvasRef = useRef(null);

  //Modal para cargar imagenes
  const showModal = () => {
    setIsModalVisible(true);
  };

  //Ok el modal
  const handleOk = () => {
    setIsModalVisible(false);
    const img = document.querySelector("img");
    // setUrlImg(img.attributes[0].value);
  };

  //Cancelar el Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Funcion para cargar imagenes y usar arrastrar y soltar
  function UploadAvatar(props) {
    const { avatar, setAvatar } = props;

    const onDrop = useCallback(
      (acceptedFiles) => {
        const file = acceptedFiles[0];
        //Variable con el tamaño del archivo
        setTamaño(file.size);
        //Variable con el tipo de archivo
        setFormato(file.type);
        setResolucion(file.resolution);

        //Variable que almacena la url temporal para pintar la imagen en el canva
        setUrlImg(URL.createObjectURL(file));
        setAvatar({ file, preview: URL.createObjectURL(file) });
      },
      [setAvatar]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: "image/jpeg, image/jpg, image/png",
      noKeyboard: true,
      onDrop,
    });

    return (
      <div className="upload-avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Avatar size={200} src={NoImage} />
        ) : (
          <Avatar size={200} src={avatar ? avatar.preview : NoImage} />
        )}
      </div>
    );
  }

  //Calculo de la variable resolucion
  const calcResolution = () => {
    //Validacion para evitar error en calc resolucion
    if(tamaño == 0){
      notification.open({
        message: 'Upps',
        description:
          'Por favor carga una imagen para calcular su resolución',
      });
    } else{
    const img = document.querySelector("img");
    const inputResolution = document.getElementById("resolution");

    const altoOriginal = img.naturalHeight;
    const anchoOriginal = img.naturalWidth;
    const resolution = anchoOriginal + "x" + altoOriginal + " (píxeles)";

    inputResolution.value = resolution;

    document.getElementById("resolution").innerHTML = resolution;
    }
  };

  // Convertir de RGB a Hexadecimal
  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255) throw "Color Invalido";
    return ((r << 16) | (g << 8) | b).toString(16);
  };

  return (
    <div className="ficha">
      <Card
        hoverable
        style={{ width: 300 }}
        cover={
          <canvas
            ref={canvasRef}
            onMouseMove={async (event) => {
              setCordx(event.clientX);
              setCordy(event.clientY);

              const canvas = await canvasRef.current;

              var img = new Image();
              img.src = urlImage;

              img.onload = function () {
                ctx.drawImage(img, 0, 0, 200, 200);
                img.style.display = "none";
              };

              var hoveredColor = document.getElementById("colorRgb");
              var selectedColor = document.getElementById("colorHex");

              const ctx = canvas.getContext("2d");

              function pick(event, destination) {
                var x = event.layerX;
                var y = event.layerY;
                var pixel = ctx.getImageData(x, y, 1, 1);
                var data = pixel.data;

                const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
                destination.style.background = rgb;
                destination.textContent = rgb;
                setColorRgb(rgb);
                setColorHexa(rgbHex(rgb));

                return rgb;
              }

              canvas.addEventListener("mousemove", function (event) {
                pick(event, hoveredColor);
              });
              canvas.addEventListener("click", function (event) {
                pick(event, selectedColor);
              });
            }}
          />
        }
      >
        <Button type="primary" onClick={showModal}>
          Subir Imagen
        </Button>
        <Modal
          title="Sube tu Imagen"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <UploadAvatar avatar={avatar} setAvatar={setAvatar} />
          <br></br>Puedes Arrastrar la imagen o dar click sobre ella para subir
          una nueva
        </Modal>

        <Button id="calculo" type="danger" onClick={calcResolution}>
          Calc Resolución
        </Button>

        <Button type="text">Resolución</Button>
        <Input id="resolution" placeholder="Resolución" disabled />
        <Button type="text">Formato</Button>
        <Input placeholder={formato} disabled />
        <Button type="text">Tamaño (Kb)</Button>
        <Input id="tamaño" placeholder={tamaño / 1000} disabled />
        <Button type="text">Coordenadas</Button>
        <Input id="coordenadas" placeholder={cordx + ", " + cordy} disabled />
        <Button type="text">Color RGB</Button>
        <Input
          id="colorRgb"
          placeholder={colorRgb}
          disabled
          onChange={rgbToHex()}
        />
        <Button type="text">Color Hexadecimal</Button>
        <Input id="colorHex" placeholder={"#" + colorHexa} disabled />
      </Card>
    </div>
  );
};

export default Ficha;
