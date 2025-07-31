//const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Para Android Emulator
// const API_BASE_URL = 'http://localhost:3000/api'; // Para iOS Simulator
 const API_BASE_URL = 'http://192.168.0.51:3000/api'; // Para dispositivo físico

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  target: string;
  gifUrl?: string;
  instructions?: string[];
}

interface Food {
  id: string;
  name: string;
  category: string;
  energy: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  image?: string;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  exercises: any[];
  duration?: number;
  notes?: string;
  date: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Exercícios
  async getExercisesByMuscle(muscleGroup: string): Promise<Exercise[]> {
    const response = await this.request<{ exercises: Exercise[] }>(
      `/exercise/muscle/${muscleGroup}`
    );
    return response.data.exercises;
  }

  async getAllExercises(): Promise<Exercise[]> {
    const response = await this.request<{ exercises: Exercise[] }>(
      '/exercise/all'
    );
    return response.data.exercises;
  }

  // Exercícios da API Wger (integrados)
  async getWgerExercises(limit?: number, category?: string): Promise<Exercise[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);
    
    const response = await this.request<{ exercises: Exercise[] }>(
      `/integrated/exercises?${params.toString()}`
    );
    return response.data.exercises;
  }

  // Alimentos da API Wger (integrados)
  async getWgerFoods(limit?: number, category?: string): Promise<Food[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);
    
    const response = await this.request<{ foods: Food[] }>(
      `/integrated/foods?${params.toString()}`
    );
    return response.data.foods;
  }

  async getBodyParts(): Promise<string[]> {
    const response = await this.request<{ bodyParts: string[] }>(
      '/exercise/body-parts'
    );
    return response.data.bodyParts;
  }

  async getEquipment(): Promise<string[]> {
    const response = await this.request<{ equipment: string[] }>(
      '/exercise/equipment'
    );
    return response.data.equipment;
  }

  async searchExercises(params: {
    muscleGroup?: string;
    equipment?: string;
    target?: string;
    limit?: number;
    page?: number;
  }): Promise<{
    exercises: Exercise[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await this.request<{
      exercises: Exercise[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/exercise/search?${queryParams.toString()}`);

    return response.data;
  }

  // Treinos
  async createWorkout(workoutData: Partial<Workout>): Promise<Workout> {
    const response = await this.request<{ workout: Workout }>(
      '/workout',
      {
        method: 'POST',
        body: JSON.stringify(workoutData),
      }
    );
    return response.data.workout;
  }

  async getWorkouts(): Promise<Workout[]> {
    const response = await this.request<{ workouts: Workout[] }>(
      '/workout'
    );
    return response.data.workouts;
  }

  async getWorkout(id: string): Promise<Workout> {
    const response = await this.request<{ workout: Workout }>(
      `/workout/${id}`
    );
    return response.data.workout;
  }

  async updateWorkout(id: string, workoutData: Partial<Workout>): Promise<Workout> {
    const response = await this.request<{ workout: Workout }>(
      `/workout/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(workoutData),
      }
    );
    return response.data.workout;
  }

  async deleteWorkout(id: string): Promise<void> {
    await this.request(`/workout/${id}`, {
      method: 'DELETE',
    });
  }

  // Favoritos
  async getFavorites(): Promise<Exercise[]> {
    const response = await this.request<{ favorites: Exercise[] }>(
      '/exercise/favorites'
    );
    return response.data.favorites;
  }

  async addToFavorites(exerciseData: {
    exerciseId: string;
    name: string;
    muscleGroup: string;
    equipment: string;
    target: string;
    gifUrl?: string;
    instructions?: string[];
  }): Promise<void> {
    await this.request('/exercise/favorites', {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  }

  async removeFromFavorites(exerciseId: string): Promise<void> {
    await this.request(`/exercise/favorites/${exerciseId}`, {
      method: 'DELETE',
    });
  }

  async checkFavorite(exerciseId: string): Promise<boolean> {
    const response = await this.request<{ isFavorite: boolean }>(
      `/exercise/favorites/check/${exerciseId}`
    );
    return response.data.isFavorite;
  }

  // Autenticação (para futuras implementações)
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    return response.data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    height: number;
    weight: number;
    goal: string;
  }): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    return response.data;
  }

  // Configurar token para requisições autenticadas
  setAuthToken(token: string) {
    // Implementar lógica para adicionar token aos headers
    this.authToken = token;
  }

  // IA Integrada
  async suggestWorkoutWithAI(preferences: any): Promise<any> {
    const response = await this.request<any>(
      '/integrated/ai/suggest-workout',
      {
        method: 'POST',
        body: JSON.stringify({ preferences }),
      }
    );
    return response.data;
  }

  async suggestDietWithAI(preferences: any): Promise<any> {
    const response = await this.request<any>(
      '/integrated/ai/suggest-diet',
      {
        method: 'POST',
        body: JSON.stringify({ preferences }),
      }
    );
    return response.data;
  }

  async chatWithAI(message: string): Promise<any> {
    const response = await this.request<any>(
      '/integrated/ai/chat',
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      }
    );
    return response.data;
  }

  // Cálculos automáticos
  async calculateNutritionNeeds(): Promise<any> {
    const response = await this.request<any>('/integrated/calculations/nutrition');
    return response.data;
  }

  async estimateCaloriesBurned(workout: any): Promise<any> {
    const response = await this.request<any>(
      '/integrated/calculations/calories',
      {
        method: 'POST',
        body: JSON.stringify({ workout }),
      }
    );
    return response.data;
  }

  private authToken?: string;

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }
}

export const apiService = new ApiService();
export default apiService; 