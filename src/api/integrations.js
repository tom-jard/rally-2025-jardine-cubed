// Mock integrations to replace Base44 integrations

// Mock LLM invocation
export async function InvokeLLM({ prompt, file_urls, response_json_schema }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response for "touch grass" photo analysis
  if (prompt.includes('outdoor') || prompt.includes('grass')) {
    // Randomly determine if photo is "outdoor" for demo purposes
    const isOutdoor = Math.random() > 0.3; // 70% chance of success
    
    return {
      is_outdoor: isOutdoor,
      reasoning: isOutdoor 
        ? "I can see natural outdoor elements like grass, trees, or sky in this image."
        : "This appears to be taken indoors or in an urban setting without natural outdoor elements."
    };
  }
  
  // Default response
  return {
    success: true,
    message: "LLM processing completed",
  };
}

// Mock file upload
export async function UploadFile({ file }) {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock file URL
  const mockUrl = `https://api.playd.app/uploads/${Date.now()}-${file.name}`;
  
  return {
    file_url: mockUrl,
    success: true,
  };
}

// Mock health data integration
export async function getHealthData() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    steps: Math.floor(Math.random() * 5000) + 3000,
    workouts: Math.floor(Math.random() * 3),
    activeMinutes: Math.floor(Math.random() * 120) + 30,
    lastSync: new Date().toISOString(),
  };
}

// Mock Claude integration
export async function invokeClaude({ prompt, context }) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock Claude response
  return {
    response: "Thank you for sharing your thoughts! This looks like a meaningful journal entry. Keep up the great work with your daily reflection practice.",
    word_count: prompt.split(' ').length,
    sentiment: "positive",
    success: true,
  };
}