import { useState, useEffect } from 'react'

import "./PredictionDisplay.css" // style sheet


function PredictionDisplay({prediction, selectedImage}) {
    const [results, setResults] = useState();

    useEffect(() => {
        const parsePrediction = () => {
            if (prediction == null){
                if (selectedImage) {
                    setResults(<p>Click predict</p>);
                } else {
                    setResults(null);
                }

                return;
            };

            let parsed;
            if (prediction[0].probability < 0.5) { 
                // uncertain prediction
                parsed = <h2>May be: {prediction.map(i => <li>{i.className}</li>)}</h2>;
            } else {          
                parsed = [<h1>Likely: {prediction[0].className}</h1>];
                
                if (prediction[1].probability > 0.05) {
                    // second prediction has reasonable probability
                    parsed.push(<h2>May also be: {prediction[1].className}</h2>)
                }
            };
            setResults(parsed);
        };
        parsePrediction();
    }, [prediction]);

    return (
        <div id="prediction-container">
            {
            results
                ? <>{results}</>
                : <p>Upload an image and press predict to get a prediction</p>
            }
        </div>
    );
};

export default PredictionDisplay;