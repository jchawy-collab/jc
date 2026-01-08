
import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square, Upload, FileAudio, Loader2 } from 'lucide-react';
import { AppStatus } from '../types';

interface AudioControlsProps {
  status: AppStatus;
  onAudioReady: (blob: Blob, fileName: string) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ status, onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        onAudioReady(blob, `Recording-${new Date().toISOString()}.webm`);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioReady(file, file.name);
    }
  };

  const isProcessing = status === AppStatus.UPLOADING || status === AppStatus.PROCESSING;

  return (
    <div className="flex flex-col items-center gap-8 p-12 bg-white rounded-3xl shadow-xl border border-gray-100 transition-all duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Voice Capture</h2>
        <p className="text-gray-500 max-w-sm">Record a meeting or upload an existing audio file for deep analysis.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Record Button */}
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className={`flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Mic size={24} />}
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all shadow-lg animate-pulse"
          >
            <Square size={24} />
            Stop Recording
          </button>
        )}

        {/* Upload Button */}
        <label className={`flex items-center gap-3 px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-full font-semibold cursor-pointer transition-all shadow-md ${isProcessing || isRecording ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={24} />
          Upload File
          <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {isProcessing && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-indigo-600 font-medium">
            <Loader2 className="animate-spin" size={20} />
            <span>{status === AppStatus.UPLOADING ? 'Uploading to AI...' : 'Analyzing conversation...'}</span>
          </div>
          <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-shimmer" style={{ width: '100%', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #4f46e5 0%, #818cf8 50%, #4f46e5 100%)' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};
