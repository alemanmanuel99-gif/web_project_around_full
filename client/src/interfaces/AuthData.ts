export interface RegisterResponse {
  data: {
    email: string;
    _id: string;
  };
}

export interface LoginResponse {
  token: string;
}

export interface CheckTokenResponse {
  data: {
    _id: string;
    email: string;
  };
}
