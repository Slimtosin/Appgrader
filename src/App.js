import React, { useState } from 'react';
import { Storage, API } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      // Upload file to S3
      const fileName = `${Date.now()}_${file.name}`;
      await Storage.put(fileName, file, {
        contentType: file.type,
      });

      // Invoke Lambda via API Gateway
      const response = await API.post('yourApiName', '/grade', {
        body: { fileName },
      });

      setResult(response.result);
    } catch (error) {
      console.error('Error grading assignment:', error);
    }
  };

  return (
    <div className="App">
      <h1>Handwriting Assignment Grader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      <p>Result: {result}</p>
    </div>
  );
}

export default withAuthenticator(App);


