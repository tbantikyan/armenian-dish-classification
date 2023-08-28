import "./ImageUploader.css" // style sheet

function ImageUploader({ selectedImage, setSelectedImage, prediction, setPrediction, runModel }) {
    return (
        // Image uploader
        <div id="uploader-container">
            <div id="image-container">
                {
                selectedImage == null
                    ? <label id="upload-button" htmlFor="image-upload">Click to upload an image</label>
                    : selectedImage && (
                        <>
                            <img
                                id="selected-image-shown"
                                alt="user image"
                                crossOrigin="anonymous"
                                src={selectedImage}
                            />
                            {/*  Uncropped image for model */}
                            <img
                                id="selected-image"
                                className="hidden"
                                alt="user image"
                                crossOrigin="anonymous"
                                src={selectedImage}
                            />
                        </>
  
                    )
                }
                <br />
                <input hidden
                    type="file"
                    name="myImage"
                    id="image-upload"
                    accept="image/*"
                    onChange={(event) => {
                        setSelectedImage(URL.createObjectURL(event.target.files[0]));
                        setPrediction(null);
                    }}
                />
            </div>
            <div id="image-buttons">
                <button className="buttons left" disabled={selectedImage ? false : true} onClick={() => {
                    setSelectedImage(null)
                    document.getElementById("image-upload").value = "";
                }}>Remove</button>
                <button className="buttons right" disabled={selectedImage && !prediction ? false : true} onClick={() => runModel()}>Predict</button>
            </div>
        </div>
    );
};

export default ImageUploader