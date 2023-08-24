import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from 'react'
import * as tf from "@tensorflow/tfjs";

import DISH_CLASSSES from "./assets/dishClasses"; // dictionary with model classes
import firebaseStorage from "./api/firebaseconfig.js" // object for firebase storage reads
import ImageUploader from "./components/ImageUploader"; // image uploading component
import NavBar from "./components/NavBar";

import './App.css' // stylesheet
import PredictionDisplay from "./components/PredictionDisplay";

// run model for uplaoded image and set predicition
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
    setPrediction(top3);
  })
};

function App() {
  const [model, setModel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);


  // load trained model
  useEffect(() => {
    const fetchModel = async () => {
      if (model) { // prevent repeated calls
        return;
      };

      const modelRef = ref(firebaseStorage, 'model.json');
      const modelUrl = await getDownloadURL(modelRef);
      const loadedModel = await tf.loadLayersModel(modelUrl);
      setModel(loadedModel);
    };
    fetchModel();
  }, [model]);

  return (
    <>
      <header>
        <NavBar />
      </header>
      {
      model 
        ? <div>
            <ImageUploader selectedImage={selectedImage} setSelectedImage={setSelectedImage} setPrediction={setPrediction} />
            <br />
            {
            selectedImage && !prediction
              ? <button onClick={() => runModel(model, setPrediction)}>Predict</button>
              : null
            }
            <PredictionDisplay prediction={prediction} selectedImage={selectedImage} />
          </div>
        : <p>Loading model...</p>
      }
    </>
  );
};

export default App;