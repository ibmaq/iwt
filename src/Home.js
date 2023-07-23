import html2canvas from "html2canvas";
import React, { useRef, useState } from "react";
import FontPicker from "font-picker-react";

function Home() {
  // imports

  // States
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [objectFit, setObjectFit] = useState("cover");
  const [finalImageWidth, setFinalImageWidth] = useState(0);
  const [finalImageHeight, setFinalImageHeight] = useState(0);
  const [text, setText] = useState("Hello");
  const [fontColor, setFontColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("transparent");
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState(400);
  const [fontFamily, setFontFamily] = useState("Open Sans");
  const [fontsList, setFontsList] = useState([]); // [{name: "Arial", url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"}

  // Variables
  const fontWeights = {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900,
  };

  // Refs
  const parentRef = useRef(null);
  const childRef = useRef(null);

  // Functions
  const handleImageUpload = (e) => {
    let image = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile(reader.result);
    };
    reader.readAsDataURL(image);

    const bgImage = new Image();
    bgImage.onload = () => {
      calculateImageDimensions(bgImage.width, bgImage.height);
    };
    bgImage.src = URL.createObjectURL(image);
    setIsSelected(true);
  };

  const calculateImageDimensions = (bgImageWidth, bgImageHeight) => {
    const containerWidth = window.innerWidth - 64;
    const containerHeight = window.innerHeight - 176;

    if (bgImageWidth <= containerWidth && bgImageHeight <= containerHeight) {
      setFinalImageWidth(bgImageWidth);
      setFinalImageHeight(bgImageHeight);
      setObjectFit("unset");
    } else {
      const widthRatio = containerWidth / bgImageWidth;
      const heightRatio = containerHeight / bgImageHeight;
      const scale = Math.min(widthRatio, heightRatio);

      setFinalImageWidth(bgImageWidth * scale);
      setFinalImageHeight(bgImageHeight * scale);
      setObjectFit("contain");
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);

    const containerRect = parentRef.current.getBoundingClientRect();
    const childRect = childRef.current.getBoundingClientRect();

    let x = e.clientX - containerRect.x - childRect.width / 2;
    let y = e.clientY - containerRect.y - childRect.height / 2;
    if (x < 0) {
      x = 0;
    } else if (x > containerRect.width - childRect.width) {
      x = containerRect.width - childRect.width;
    }

    if (y < 0) {
      y = 0;
    } else if (y > containerRect.height - childRect.height) {
      y = containerRect.height - childRect.height;
    }

    setPosition({ x, y });
  };

  const downloadImage = () => {
    html2canvas(document.querySelector("#divToPrint")).then((canvas) => {
      const link = document.createElement("a");
      link.download = "iwt-image.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleFontFamilyChange = (e) => {
    console.log("first", e.target);
    // setFontFamily(e.target.value);
  };

  const resetAllStates = () => {
    setSelectedFile(null);
    setIsSelected(false);
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setObjectFit("cover");
    setFinalImageWidth(0);
    setFinalImageHeight(0);
  };

  return (
    <>
      <div className="p-8 w-full h-screen flex flex-col gap-4 bg-sky-100 relative">
        {!isSelected && (
          <div
            className="p-4 bg-white rounded-lg capitalize transition-all ease-in-out duration-300 shadow-sm hover:shadow-lg w-full max-w-[600px] mx-auto relative"
            onClick={resetAllStates}
          >
            <div className="flex flex-col gap-4 justify-center items-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer">
              <img
                src="/icons/img_placeholder.webp"
                alt="upload-icon"
                className="w-32"
              />
              <h1 className="text-xl font-light">
                Click here to upload your image
              </h1>
            </div>
            <input
              type="file"
              id="file"
              name="file"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              onChange={handleImageUpload}
            ></input>
          </div>
        )}
        {isSelected && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl leading-none font-semibold">
              Image Preview
            </h1>
            <div
              id="divToPrint"
              className="w-full relative bg-white rounded"
              ref={parentRef}
              style={{
                width: `${finalImageWidth}px`,
                height: `${finalImageHeight}px`,
                overflow: "hidden",
              }}
            >
              <img
                src={selectedFile}
                alt="Uploaded"
                style={{
                  width: finalImageWidth,
                  height: finalImageHeight,
                  objectFit: objectFit,
                }}
                draggable="false"
              />
              <p
                className={`apply-font absolute ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  left: position.x,
                  top: position.y,
                  color: `${fontColor}`,
                  backgroundColor: `${bgColor}`,
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight,
                  fontFamily: `${fontFamily}`,
                }}
                draggable="true"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                ref={childRef}
              >
                {text}
              </p>
            </div>
          </div>
        )}
        {isSelected && (
          <div className="flex w-full max-w-[calc(100vw-64px)] gap-4 fixed bottom-4 justify-between">
            <button
              className="px-6 py-2 text-white rounded-lg capitalize relative transition-all ease-in-out duration-300 shadow-sm hover:shadow-lg bg-red-600 hover:bg-red-400"
              onClick={resetAllStates}
            >
              <h1 className="cursor-pointer">Start Over</h1>
            </button>
            <div className="flex flex-col gap-1">
              <label className="text-md">Enter text to display</label>
              <input
                type="text"
                placeholder="Hello"
                className="rounded-md px-2.5 py-1 shadow-md"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md">Font Color</label>
              <div className="flex gap-2">
                <div
                  className="relative w-8 h-8 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: `${fontColor}` }}
                >
                  <input
                    type="color"
                    className="absolute w-full h-full opacity-0"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  className="rounded-md px-2.5 py-1 shadow-md"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md">Background Color</label>
              <div className="flex gap-2">
                <div
                  className="relative w-8 h-8 rounded-sm border border-neutral-700"
                  style={{ backgroundColor: `${bgColor}` }}
                >
                  <input
                    type="color"
                    className="absolute w-full h-full opacity-0"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  className="rounded-md px-2.5 py-1 shadow-md"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md">Font Size</label>
              <input
                type="text"
                className="rounded-md px-2.5 py-1 shadow-md"
                value={fontSize}
                onChange={(e) =>
                  e.target.value < 72
                    ? setFontSize(e.target.value)
                    : setFontSize(72)
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md">Font Weight</label>
              <select className="rounded-md px-2.5 py-1 shadow-md w-full">
                {Object.keys(fontWeights).map((weightTitle) => {
                  return (
                    <option
                      value={weightTitle}
                      onChange={setFontWeight(fontWeights[weightTitle])}
                    >
                      {weightTitle}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-md">Font Family</label>
              <FontPicker
                apiKey="AIzaSyAS5dU5lthauydMnPv03IL8lBYhKnwmsaM"
                activeFontFamily={fontFamily}
                onChange={(nextFont) => {
                  setFontFamily(nextFont.family);
                }}
                // onChange={handleFontFamilyChange}
              />
            </div>
            <button
              onClick={downloadImage}
              className="px-6 py-2 text-white rounded-lg capitalize relative transition-all ease-in-out duration-300 shadow-sm hover:shadow-lg bg-green-600 animate-bounce"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
