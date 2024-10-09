import React, { useState, useRef } from 'react';
import axios from 'axios'; // Импортируем axios

function AudioToTextApp() {
  const [audioFile, setAudioFile] = useState(null);
  const [fileName, setFileName] = useState('Не выбран ни один файл');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Обработчик загрузки аудиофайла
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
    setFileName(file ? file.name : 'Не выбран ни один файл');
  };

  // Функция вызова клика по скрытому input при нажатии на кнопку
  const handleFileSelectClick = () => {
    fileInputRef.current.click();
  };

  const handleConvertToText = async () => {
    if (!audioFile) {
      setError('Please upload an audio file');
      return;
    }

    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', audioFile);

      const response = await axios.post('http://localhost:3000/voice/text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscript(response.data.text || 'Unable to recognize audio.');
    } catch (err) {
      setError('An error occurred during file processing');
    }
  };

  // Функция для скачивания результата как текстового файла
  const handleDownloadText = () => {
    // Создаем объект Blob на основе текста
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    
    // Создаем ссылку для скачивания
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    
    // Добавляем ссылку в DOM и кликаем по ней для скачивания
    document.body.appendChild(element);
    element.click();
    
    // Удаляем элемент из DOM после скачивания
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Audio to Text Converter</h1>
        <p className="text-xl text-gray-500 mb-8">Transform your audio into accurate, clean text.</p>
      </div>

      <div className="bg-gray-100 p-10 rounded-2xl shadow-lg w-full max-w-3xl">
        {/* Скрытый input для загрузки файла */}
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={handleFileSelectClick}
          className="block w-120 bg-gray-200 text-gray-900 py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300 mb-2"
        >
          Выбор файла
        </button>

        <p className="text-sm text-gray-600 mb-6">{fileName}</p>

        <button
          onClick={handleConvertToText}
          className="w-full bg-black text-white font-medium text-lg py-3 rounded-full hover:bg-gray-800 transition duration-300"
        >
          Convert
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {transcript && (
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-2 text-gray-700">Conversion Result:</h3>

            <p className="mb-6 p-4 bg-white border border-gray-300 rounded-lg text-gray-900 leading-relaxed">
              {transcript}
            </p>

            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              rows="6"
              value={transcript}
              readOnly
            ></textarea>

            <button
              onClick={handleDownloadText}
              className="w-full mt-4 bg-gray-800 text-white font-medium py-3 rounded-full hover:bg-gray-700 transition duration-300"
            >
              Download as Text File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioToTextApp;
