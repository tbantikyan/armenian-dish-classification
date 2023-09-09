import { ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from 'react'
import * as tf from "@tensorflow/tfjs";

import DISH_CLASSSES from "./assets/dishClasses"; // dictionary with model classes
import firebaseStorage from "./api/firebaseconfig.js" // object for firebase storage reads
import ImageUploader from "./components/ImageUploader"; // image uploading component
import logo from "./assets/sohamov-logo.png" // site logo
import NavBar from "./components/NavBar"; // navigation bar component
import PredictionDisplay from "./components/PredictionDisplay"; // prediction display component


import './App.css' // stylesheet


function App() {
  const [model, setModel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // run model for uplaoded image and set predicition
  async function runModel() {
    const imageElement = document.getElementById("selected-image");
    let tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(127.5))
      .sub(tf.scalar(1))
      .expandDims();
    model.predict(tensor).data().then(predictions => {
      let top3 = Array.from(predictions)
        .map((p, i) => {
          return {
            probability: p,
            className: DISH_CLASSSES[i]
          }
        }).sort((a, b) => {
          return b.probability - a.probability;
        }).slice(0, 3);
      setPrediction(top3);
    })
  };

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

  if (!model) {
    return (
      <div id="loading">
        <img src={logo} width={200} />
        <div id="loading-text">
          <p>Loading model</p>
          <div id="ellipsis"></div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <header>
          <NavBar />
        </header>
        <main>
          <div id="model-logic">
            <ImageUploader 
              selectedImage={selectedImage} 
              setSelectedImage={setSelectedImage} 
              prediction={prediction} 
              setPrediction={setPrediction} 
              runModel={runModel} 
            />
            <PredictionDisplay 
              prediction={prediction} 
              selectedImage={selectedImage} 
            />
          </div>
          <div id="How_it_works">
            <h3 id="section-header">How it works</h3>
            <p className="info">
              So Hamov (hamov or համով meaning delicious in Armenian) is an image classification app that uses a trained 
              machine learning model to identify dishes popular in Armenian cuisine. Although many of these dishes are 
              enjoyed in several cultures around the world, the model was trained to classify them because they are 
              particularly staples of Armenian cuisine and culture.
              <br /><br />
              <span className="bold">Uploading an image</span><br/>
              To provide the machine learning mdoel an image to classify, upload an image format file by clicking within 
              the box on the left. You can ensure that the prediction is as accurate as possible by using a high quality 
              image. Avoid low-resolution, blurry, and low-light photos. The dish you wish to identify should also be 
              clearly in frame, with as few additional subjects as possible.
              <br /><br />
              <span className="bold">Understanding the prediction</span><br/>
              Upon pressing predict, the model determines probabilities for each potential classification. If the model is
              very confident, only one prediction will be shown. Otherwise, two or three prediction may be shown at once. 
              The webapp will also display information about the model's most confident prediction. To view information about a different prediction, you can click on the
              corresponding predicted dish name.
              <br /><br />
              <span className="lightBold">Note:</span> if none of the predictions are correct, then either:<br />
              <span className="dashed-item">The image quality is not suitable for the model.</span><br/>
              <span className="dashed-item">The dish in the image is not a dish that the model was trained on.</span><br/>
              <br />
              Dishes the model has been trained to classify:<br />
              <div id="class-list">
                <div>
                  <span className="dashed-item">ghapama (ղափամա)</span><br/>
                  <span className="dashed-item">gata (գաթա)</span><br/>
                  <span className="dashed-item">basturma (բաստուրմա)</span><br/>
                </div>
                <div>
                  <span className="dashed-item">manti (մանթի)</span><br/>
                  <span className="dashed-item">kufta (քուֆթա)</span><br/>
                  <span className="dashed-item">tolma (տոլմա)</span><br/>
                </div>
                <div>
                  <span className="dashed-item">spas (սպաս)</span><br/>
                  <span className="dashed-item">lahmajo (լահմաջո)</span><br/>
                  <span className="dashed-item">harissa (հարիսա)</span><br/>
                </div>
              </div>
            </p>
            <h3 id="section-header">About the app</h3>
            <p className="info">
              I got the idea to make this app after a few instances of friends reaching out to me with hopes that I could 
              identify an Armenian dish they had eaten at a gathering or restaurant. Intriguied by machine learning and 
              image analysis, I thought it'd be a fun project to create a webapp that could classify staples of Armenian
              cuisine.<br/>
              <br/>
              I gathered a dataset of nearly one thousand images of dishes and trained the model with a success rate of roughly
              98% in testing. I developed a functional and visually appealing webapp with React to allow anyone to 
              play around with the model. Overall, the project was enjoyable and a wonderful learning activity. 
            </p>
          </div>
        </main>
        <footer>
          
        </footer>
      </>
    );
  }
};

export default App;