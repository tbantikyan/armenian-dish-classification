function ImageUploader({selectedImage, setSelectedImage, setPrediction}) {
    return (
        // Image uploader
        <div>
            {
            selectedImage == null 
                ? <p>Upload an image of a dish</p>
                : selectedImage && (
                    <div>
                        <img
                            id="selectedImage"
                            alt="user image"
                            crossOrigin="anonymous"
                            width={"250px"}
                            src={URL.createObjectURL(selectedImage)}
                        />
                        <br />
                        <button onClick={() => {
                            setSelectedImage(null)
                            document.getElementById("imageUpload").value = "";
                        }}>Remove</button>

                    </div>
                )
            }

            <br />
            <input hidden
                type="file"
                name="myImage"
                id="imageUpload"
                onChange={(event) => {
                    console.log(event.target.files[0]);
                    setSelectedImage(event.target.files[0]);
                    setPrediction(null);
                }}
            />
            <label className="uploadButton" htmlFor="imageUpload">Upload</label>
        </div>
        
    );
};

export default ImageUploader