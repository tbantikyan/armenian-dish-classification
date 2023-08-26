import "./ImageUploader.css" // style sheet

function ImageUploader({ selectedImage, setSelectedImage, setPrediction }) {
    return (
        // Image uploader
        <div id="uploader-container">
            <div id="image-container">
                {
                selectedImage == null
                    ? <p>Upload an image of a dish</p>
                    : selectedImage && (
                        <img
                            id="selected-image"
                            alt="user image"
                            crossOrigin="anonymous"
                            width="100%"
                            src={URL.createObjectURL(selectedImage)}
                        />
                    )
                }
                <br />
                <input hidden
                    type="file"
                    name="myImage"
                    id="image-upload"
                    onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                        setPrediction(null);
                    }}
                />
            </div>
            <div id="image-buttons">
                <label className="buttons" htmlFor="image-upload">Upload</label>
                {
                selectedImage
                    ? <button className="buttons" onClick={() => {
                        setSelectedImage(null)
                        document.getElementById("image-upload").value = "";
                    }}>Remove</button>
                    : null
                }
            </div>
        </div>
    );
};

export default ImageUploader