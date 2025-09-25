import React, { useState, useEffect } from 'react';
import { InvokeLLM, UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, Loader2, AlertCircle, Sparkles, Upload } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { useUser } from '@/contexts/UserContext';

const REWARD = 100;

export default function ActionOfTheDay() {
  const { user, updateUserDarumas } = useUser();
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.lastGrassTouchedDate && isToday(parseISO(user.lastGrassTouchedDate))) {
      setIsCompletedToday(true);
    }
  }, [user]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const { file_url } = await UploadFile({ file });

      const llmResponse = await InvokeLLM({
        prompt: "Analyze this image. Was it taken outdoors in a natural or park-like environment (e.g., grass, trees, sky are visible)? The user is trying to 'touch grass'. Respond ONLY with a JSON object: {\"is_outdoor\": boolean, \"reasoning\": string}",
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            is_outdoor: { type: "boolean" },
            reasoning: { type: "string" },
          },
          required: ["is_outdoor", "reasoning"]
        }
      });

      if (llmResponse.is_outdoor) {
        setMessage({ type: 'success', text: `Great shot! ${llmResponse.reasoning}. You earned ${REWARD} darumas!` });
        setIsCompletedToday(true);
        
        // Update darumas and completion date
        await updateUserDarumas(REWARD);
        // Note: In a real app, you'd also update lastGrassTouchedDate in the backend
      } else {
        setMessage({ type: 'error', text: `That was not outside! ${llmResponse.reasoning}. Try taking a photo outdoors!` });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Something went wrong analyzing your photo. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="glass-card rounded-2xl p-6 min-h-[160px]"><Loader2 className="animate-spin" /></div>;
  }

  if (isCompletedToday) {
    return (
      <motion.div layout className="glass-card rounded-2xl p-6 text-center bg-green-500/10 border-green-500/30">
        <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-2" />
        <h3 className="text-xl font-bold">Action of the Day Completed!</h3>
        <p className="text-green-300">You earned {REWARD} darumas. Come back tomorrow!</p>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="glass-card rounded-2xl p-6 text-center">
      <h3 className="text-xl font-bold flex items-center justify-center gap-2 mb-2"><Sparkles className="text-yellow-400"/> Action of the Day</h3>
      <p className="text-purple-300 mb-4 text-2xl font-bold">"Touch Grass" (+{REWARD} darumas)</p>
      <p className="text-gray-300 mb-4">Upload a photo of you being outside to earn a daily reward.</p>

      <Button asChild className="bg-purple-600 hover:bg-purple-700 cursor-pointer" size="lg" disabled={isProcessing}>
        <label htmlFor="photo-upload">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
        </label>
      </Button>
      <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isProcessing} />

      {message && (
        <div className={`mt-4 text-sm flex items-center justify-center gap-2 p-2 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}
    </motion.div>
  );
}