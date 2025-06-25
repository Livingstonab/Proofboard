// API integration utilities
export const TAVUS_API_KEY = '02f53ba1fa684cbd855d0fe3a0dcbc61';
export const LINGO_API_KEY = 'api_vrav2fic3bhbgxlcxd2o62sk';
export const REVENUECAT_PUBLIC_KEY = 'pdl_rVpnFlqLqpBnIzHaogVKIeHxNYqr';
export const ALGORAND_TESTNET_URL = 'https://testnet-api.algonode.cloud';

// Tavus AI Video Generation
export const generateTavusVideo = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://tavusapi.com/v2/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY,
      },
      body: JSON.stringify({
        replica_id: 'default',
        script: message,
        background_url: '',
      }),
    });
    
    const data = await response.json();
    return data.video_url || '';
  } catch (error) {
    console.error('Tavus API Error:', error);
    return '';
  }
};

// Simple translation fallback for demo purposes
const getSimpleTranslation = (text: string, targetLang: string): string => {
  const translations: Record<string, Record<string, string>> = {
    fr: {
      'hello': 'bonjour',
      'project': 'projet',
      'description': 'description',
      'title': 'titre',
      'welcome': 'bienvenue',
      'portfolio': 'portefeuille',
      'dashboard': 'tableau de bord',
      'settings': 'paramètres',
      'profile': 'profil',
      'analytics': 'analytique',
      'premium': 'premium',
      'explore': 'explorer',
      'login': 'connexion',
      'signup': 'inscription',
      'resume': 'curriculum vitae'
    },
    es: {
      'hello': 'hola',
      'project': 'proyecto',
      'description': 'descripción',
      'title': 'título',
      'welcome': 'bienvenido',
      'portfolio': 'portafolio',
      'dashboard': 'panel de control',
      'settings': 'configuración',
      'profile': 'perfil',
      'analytics': 'analítica',
      'premium': 'premium',
      'explore': 'explorar',
      'login': 'iniciar sesión',
      'signup': 'registrarse',
      'resume': 'currículum'
    }
  };

  // Simple word-by-word translation for demo
  const words = text.toLowerCase().split(' ');
  const translatedWords = words.map(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return translations[targetLang]?.[cleanWord] || word;
  });

  return translatedWords.join(' ');
};

// Lingo Translation with fallback
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    // First try the actual API (this will likely fail with demo credentials)
    const response = await fetch('https://api.mymemory.translated.net/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    // If we get here, we could parse the response
    // For now, we'll use the fallback since the API key is not valid
    throw new Error('Using fallback translation');

  } catch (error) {
    console.warn('Translation API unavailable, using fallback:', error);
    
    // Use simple fallback translation for demo
    if (targetLang === 'fr') {
      return `[FR] ${getSimpleTranslation(text, 'fr')}`;
    } else if (targetLang === 'es') {
      return `[ES] ${getSimpleTranslation(text, 'es')}`;
    }
    
    return `[${targetLang.toUpperCase()}] ${text}`;
  }
};

// Algorand NFT Minting (simplified)
export const mintNFT = async (metadata: any): Promise<string> => {
  try {
    // This would typically involve more complex Algorand SDK operations
    // For demo purposes, we'll simulate the minting process
    const txId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // In production, you would:
    // 1. Create ASA (Algorand Standard Asset)
    // 2. Set metadata according to ARC3 standard
    // 3. Submit transaction to Algorand network
    
    console.log('Minting NFT with metadata:', metadata);
    return txId;
  } catch (error) {
    console.error('Algorand NFT Minting Error:', error);
    throw error;
  }
};

// IPFS Upload (using Web3.Storage simulation)
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    // Simulate IPFS upload
    const formData = new FormData();
    formData.append('file', file);
    
    // In production, you would use actual IPFS service like Pinata or Web3.Storage
    const ipfsHash = `Qm${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    throw error;
  }
};