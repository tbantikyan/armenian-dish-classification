import { useState, useEffect } from 'react'
import './App.css'
import * as tf from "@tensorflow/tfjs";
import firebaseStorage from "./api/firebaseconfig.js"
import { ref, getDownloadURL } from "firebase/storage";
import ImageUploader from "./components/ImageUploader";
import DISH_CLASSSES from "./assets/dishClasses";

async function runModel(model, setPrediction) {
  const imageElement = document.getElementById("selectedImage");
  let tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(tf.scalar(127.5))
    .sub(tf.scalar(1))
    .expandDims();
  model.predict(tensor).data().then(predictions =>{
    let top3 = Array.from(predictions)
      .map((p, i)=>{
        return {
          probability: p,
          className: DISH_CLASSSES[i]
        }
      }).sort((a, b)=>{
        return b.probability - a.probability;
      }).slice(0, 3);
    console.log(top3);
    setPrediction(top3);
  })
}

function App() {
  const [model, setModel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);


  const fetchModel = async () => {
    if (model) { // prevent repeated calls
      return;
    };

    const modelRef = ref(firebaseStorage, 'model.json');
    const modelUrl = await getDownloadURL(modelRef);
    const loadedModel = await tf.loadLayersModel(modelUrl);
    setModel(loadedModel);
    console.log("loaded");
  };

  // load trained model
  useEffect(() => fetchModel);

  return (
    <>
      {
      model 
        ? <div>
            <h1>test</h1>
            <ImageUploader selectedImage={selectedImage} setSelectedImage={setSelectedImage} setPrediction={setPrediction} />
            <br />
            {
            selectedImage && !prediction
              ? <button onClick={() => runModel(model, setPrediction)}>Predict</button>
              : null
            }
            </div>
        : <p>Loading model...</p>
      }
    </>
  );
};

export default App;