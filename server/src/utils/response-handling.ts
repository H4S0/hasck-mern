type ServiceError = {
  code?: string;
  message: string;
};

type SuccessResponse<T = unknown> = {
  success: true;
  message?: string;
  data?: T;
};

export function formatError(error: ServiceError) {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };
}

export function formatSuccess<T>(options?: {
  message?: string;
  data?: T;
}): SuccessResponse<T> {
  return {
    success: true,
    ...(options?.message && { message: options.message }),
    ...(options?.data && { data: options.data }),
  };
}
