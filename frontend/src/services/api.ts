import { APIError } from '../utils/api';
import type { ResearchData } from '../types/research';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/research/search';

// // export const fetchResearch = async (query: string, urls?: string[]): Promise<ResearchData[]> => {
// //   try {
// //     const response = await fetch(`${API_URL}/api/research`, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({ query, urls }),
// //     });

// //     if (!response.ok) {
// //       throw new APIError('Failed to fetch research data', response.status);
// //     }

// //     return await response.json();
// //   } catch (error) {
// //     if (error instanceof APIError) {
// //       throw error;
// //     }
// //     throw new APIError('An unexpected error occurred');
// //   }
// // };

// import { APIError } from '../utils/api';
// import type { ResearchData } from '../types/research';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// export const fetchResearch = async (query: string, urls?: string[]): Promise<ResearchData[]> => {
//   try {
//     const response = await fetch(`${API_URL}/api/research`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ query, urls }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new APIError(
//         errorData.message || 'Failed to fetch research data',
//         response.status
//       );
//     }

//     const data = await response.json();
    
//     // Validate that we received an array
//     if (!Array.isArray(data)) {
//       throw new APIError('Invalid response format from server');
//     }

//     return data;
//   } catch (error) {
//     console.error('Research API Error:', error);
//     if (error instanceof APIError) {
//       throw error;
//     }
//     throw new APIError('An unexpected error occurred while fetching research data');
//   }
// };

export const fetchResearch = async (query: string, urls?: string[]): Promise<ResearchData[]> => {
  try {
    console.log('Sending research request:', { query, urls });
    
    const response = await fetch(`${API_URL}/api/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, urls }),
    });

    console.log('Research API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Research API error:', errorData);
      throw new APIError(
        errorData.message || `Failed to fetch research data (${response.status})`,
        response.status
      );
    }

    const data = await response.json();
    console.log('Research API response data:', data);

    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      throw new APIError('Invalid response format from server');
    }

    return data;
  } catch (error) {
    console.error('Research API Error:', error);
    throw error;
  }
};