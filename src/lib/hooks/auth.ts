import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../api';

export function useRegister() {
  return useMutation({
    mutationFn: (data: any) => 
      apiFetch('collections/users/records/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: { identifier: string; password: string }) => 
      apiFetch('collections/users/auth/authenticate-with-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => 
      apiFetch('collections/users/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  });
}

export function useConfirmForgotPassword() {
  return useMutation({
    mutationFn: (data: any) => 
      apiFetch('collections/users/auth/confirm-forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useRequestUpdateEmail() {
  return useMutation({
    mutationFn: (data: { email: string }) => 
      apiFetch('collections/users/auth/request-update-email', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useConfirmUpdateEmail() {
  return useMutation({
    mutationFn: (data: { otp: string; new_email: string }) => 
      apiFetch('collections/users/auth/confirm-update-email', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}
