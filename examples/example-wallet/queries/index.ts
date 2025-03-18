import { testApi } from '@/apis';
import { CredentialOffer } from '@/types';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';

export const useTestQuery = () => {
  return useQuery({
    queryKey: ['test'],
    queryFn: () => testApi(),
  });
};

export const useCredentialOfferQuery = ({
  credentialOfferUri,
}: {
  credentialOfferUri: string;
}) => {
  return useQuery<CredentialOffer>({
    queryKey: ['credential-offer'],
    queryFn: async () => {
      const res = await axios.get(credentialOfferUri);
      return res.data;
    },
  });
};

export const useTokenRequestMutation = (
  options?: UseMutationOptions<{ access_token: string }>,
) => {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post('https://issuer.dev.hopae.com/token', {
        // @Todo: Replace with actual data
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        pre_authorized_code: '8swr2odf8sd2ndokdg',
        tx_code: '1111',
      });

      return res.data;
    },
    ...options,
  });
};

type CredentialMutationRes = {
  credentials: Array<{ credential: string }>;
};

export const useCredentialRequestMutation = (
  options?: UseMutationOptions<CredentialMutationRes>,
) => {
  return useMutation({
    mutationFn: async () => {
      // Todo: Enhance token management
      const tokenRes = await axios.post('https://issuer.dev.hopae.com/token', {
        // @Todo: Replace with actual data
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        pre_authorized_code: '8swr2odf8sd2ndokdg',
        tx_code: '1111',
      });

      const token = tokenRes.data.access_token;

      const res = await axios.post(
        'https://issuer.dev.hopae.com/credential',
        {
          // @Todo: Replace with actual data
          credential_identifier: 'UniversityDegreeCredential',
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return res.data;
    },
    ...options,
  });
};

export const useVerifyMetadataMutation = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post('https://verifier.dev.hopae.com/request');

      return res.data;
    },
    ...options,
  });
};
